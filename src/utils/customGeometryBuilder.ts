import * as THREE from 'three';
import { CustomGeometryScene } from '../types/customGeometry';
import { BuiltSolidModel, VertexInfo } from './geometryBuilder';
import { VisualStyle } from '../types/geometry';

export function buildCustomGeometryModel(
  sceneData: CustomGeometryScene,
  showDashed: boolean = true,
  showFaces: boolean = true,
  style: VisualStyle = 'pbr'
): BuiltSolidModel {
  const rootGroup = new THREE.Group();
  const faceMeshes: THREE.Mesh[] = [];
  const edgeLines: THREE.LineSegments[] = [];
  const dashedLines: THREE.LineSegments[] = [];
  const normalVectors: THREE.Vector3[] = [];
  const originalCenters: THREE.Vector3[] = [];
  const vertices: VertexInfo[] = [];

  // Map vertex ID to Vector3
  const vertexMap = new Map<string, THREE.Vector3>();

  // 1. Process vertices
  sceneData.vertices.forEach((v) => {
    const pos = new THREE.Vector3(v.x, v.y, v.z);
    vertexMap.set(v.id, pos);
    vertices.push({
      id: v.id,
      name: v.name,
      position: pos
    });

    // Add a subtle 3D glowing sphere marker at the vertex
    const sphereGeo = new THREE.SphereGeometry(v.isSpecial ? 0.065 : 0.045, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: v.color ? parseInt(v.color.replace('#', '0x'), 16) : 0xfbbf24,
      emissive: v.color ? parseInt(v.color.replace('#', '0x'), 16) : 0xf59e0b,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.5
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.copy(pos);
    rootGroup.add(sphereMesh);
  });

  // 2. Process faces (Polygons)
  if (showFaces && sceneData.faces && sceneData.faces.length > 0) {
    sceneData.faces.forEach((face, fIdx) => {
      const facePts = face.vertices
        .map((id) => vertexMap.get(id))
        .filter((p): p is THREE.Vector3 => Boolean(p));

      if (facePts.length >= 3) {
        const geom = new THREE.BufferGeometry();
        const positions: number[] = [];
        const center = new THREE.Vector3();
        facePts.forEach((p) => center.add(p));
        center.divideScalar(facePts.length);

        // Triangulate polygon fan
        for (let i = 1; i < facePts.length - 1; i++) {
          positions.push(facePts[0].x, facePts[0].y, facePts[0].z);
          positions.push(facePts[i].x, facePts[i].y, facePts[i].z);
          positions.push(facePts[i + 1].x, facePts[i + 1].y, facePts[i + 1].z);
        }

        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.computeVertexNormals();

        const colorNum = face.color ? parseInt(face.color.replace('#', '0x'), 16) : 0x3b82f6;
        const faceMat = new THREE.MeshStandardMaterial({
          color: colorNum,
          roughness: 0.3,
          metalness: 0.15,
          transparent: true,
          opacity: face.opacity !== undefined ? face.opacity : 0.25,
          side: THREE.DoubleSide,
          depthWrite: false
        });

        const mesh = new THREE.Mesh(geom, faceMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        rootGroup.add(mesh);
        faceMeshes.push(mesh);

        const norm = center.clone().normalize();
        normalVectors.push(norm);
        originalCenters.push(center);
      }
    });
  }

  // 3. Process edges (Solid vs Dashed)
  sceneData.edges.forEach((edge) => {
    const p1 = vertexMap.get(edge.from);
    const p2 = vertexMap.get(edge.to);
    if (!p1 || !p2) return;

    const edgeColor = edge.color ? parseInt(edge.color.replace('#', '0x'), 16) : 0xffffff;

    if (edge.isDashed) {
      if (showDashed) {
        const dashedGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const dashedMat = new THREE.LineDashedMaterial({
          color: edgeColor,
          dashSize: 0.12,
          gapSize: 0.08,
          transparent: true,
          opacity: 0.75
        });
        const dashedLine = new THREE.Line(dashedGeo, dashedMat);
        dashedLine.computeLineDistances();
        rootGroup.add(dashedLine);
      }
    } else {
      const solidGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const solidMat = new THREE.LineBasicMaterial({
        color: edgeColor,
        linewidth: edge.type === 'height' ? 2.5 : 2
      });
      const solidLine = new THREE.Line(solidGeo, solidMat);
      rootGroup.add(solidLine);
    }
  });

  // 4. Process Right-Angle Indicators (Ký hiệu vuông góc 3D chuẩn SGK)
  if (sceneData.rightAngles && sceneData.rightAngles.length > 0) {
    sceneData.rightAngles.forEach((ra) => {
      const v = vertexMap.get(ra.vertex);
      const a1 = vertexMap.get(ra.arm1);
      const a2 = vertexMap.get(ra.arm2);
      if (!v || !a1 || !a2) return;

      const size = ra.size || 0.2;
      const d1 = a1.clone().sub(v).normalize().multiplyScalar(size);
      const d2 = a2.clone().sub(v).normalize().multiplyScalar(size);

      const pCorner1 = v.clone().add(d1);
      const pCornerMid = v.clone().add(d1).add(d2);
      const pCorner2 = v.clone().add(d2);

      const cornerPts = [pCorner1, pCornerMid, pCorner2];
      const cornerGeo = new THREE.BufferGeometry().setFromPoints(cornerPts);
      const cornerMat = new THREE.LineBasicMaterial({
        color: 0xfbbf24,
        linewidth: 2
      });
      const cornerLine = new THREE.Line(cornerGeo, cornerMat);
      rootGroup.add(cornerLine);
    });
  }

  // Calculate bounding radius
  let maxDist = 2.0;
  sceneData.vertices.forEach((v) => {
    const dist = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (dist > maxDist) maxDist = dist;
  });

  return {
    group: rootGroup,
    vertices,
    faceMeshes,
    edgeLines,
    dashedLines,
    normalVectors,
    originalCenters,
    boundingRadius: maxDist * 1.2
  };
}
