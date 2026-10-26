import * as THREE from 'three';
import { VisualStyle } from '../types/geometry';

export interface VertexInfo {
  id: string;
  name: string;
  position: THREE.Vector3;
}

export interface BuiltSolidModel {
  group: THREE.Group;
  vertices: VertexInfo[];
  faceMeshes: THREE.Mesh[];
  edgeLines: THREE.LineSegments[];
  dashedLines: THREE.LineSegments[];
  normalVectors: THREE.Vector3[]; // original face directions for explode
  originalCenters: THREE.Vector3[];
  boundingRadius: number;
}

// Distinct vibrant pastel colors for faces
export const FACE_PALETTE = [
  0x3b82f6, // Blue
  0x10b981, // Emerald
  0xf59e0b, // Amber
  0xef4444, // Red
  0x8b5cf6, // Violet
  0xec4899, // Pink
  0x06b6d4, // Cyan
  0x14b8a6, // Teal
  0x84cc16, // Lime
  0xf97316, // Orange
  0x6366f1, // Indigo
  0xd946ef, // Fuchsia
  0x0ea5e9, // Sky
  0xa855f7, // Purple
  0x22c55e, // Green
  0xeab308, // Yellow
  0x64748b, // Slate
  0xf43f5e, // Rose
  0x2dd4bf, // Mint
  0x38bdf8  // Light Blue
];

/**
 * Creates appropriate material according to visual style
 */
export function createMaterial(
  style: VisualStyle,
  colorHex: number = 0x3b82f6,
  clippingPlanes?: THREE.Plane[]
): THREE.Material {
  const planes = clippingPlanes && clippingPlanes.length > 0 ? clippingPlanes : [];

  if (style === 'wireframe') {
    return new THREE.MeshBasicMaterial({
      color: colorHex,
      wireframe: true,
      clippingPlanes: planes,
      clipShadows: true,
    });
  }

  if (style === 'xray') {
    return new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      clippingPlanes: planes,
      clipShadows: true,
      side: THREE.DoubleSide
    });
  }

  if (style === 'colorful') {
    return new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.25,
      metalness: 0.15,
      clippingPlanes: planes,
      clipShadows: true,
      side: THREE.DoubleSide
    });
  }

  // 'pbr' mode: elegant studio finish with slight metallic sheen
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.18,
    metalness: 0.3,
    clippingPlanes: planes,
    clipShadows: true,
    side: THREE.DoubleSide
  });
}

/**
 * Procedurally creates geometry, vertices, and face groups for any solid
 */
export function buildSolid(
  solidId: string,
  params: Record<string, number>,
  style: VisualStyle,
  clippingPlanes?: THREE.Plane[]
): BuiltSolidModel {
  const rootGroup = new THREE.Group();
  const faceMeshes: THREE.Mesh[] = [];
  const edgeLines: THREE.LineSegments[] = [];
  const dashedLines: THREE.LineSegments[] = [];
  const normalVectors: THREE.Vector3[] = [];
  const originalCenters: THREE.Vector3[] = [];
  const vertices: VertexInfo[] = [];

  let boundingRadius = 2.5;

  // Helper to add a planar face with edges
  const addFace = (
    pts: THREE.Vector3[],
    colorIndex: number,
    normal?: THREE.Vector3
  ) => {
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const center = new THREE.Vector3();
    pts.forEach((p) => center.add(p));
    center.divideScalar(pts.length);

    // Triangulate fan from center or from pts[0]
    for (let i = 1; i < pts.length - 1; i++) {
      positions.push(pts[0].x, pts[0].y, pts[0].z);
      positions.push(pts[i].x, pts[i].y, pts[i].z);
      positions.push(pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.computeVertexNormals();

    const faceColor = style === 'pbr' ? 0x2563eb : FACE_PALETTE[colorIndex % FACE_PALETTE.length];
    const mat = createMaterial(style, faceColor, clippingPlanes);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Edge outlines for crisp textbook look
    const edgeGeom = new THREE.EdgesGeometry(geom, 15);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      clippingPlanes: clippingPlanes && clippingPlanes.length > 0 ? clippingPlanes : [],
    });
    const edgeLine = new THREE.LineSegments(edgeGeom, edgeMat);
    mesh.add(edgeLine);
    edgeLines.push(edgeLine);

    // Dashed lines for hidden-edge effect in x-ray mode
    if (style === 'xray') {
      const dashedMat = new THREE.LineDashedMaterial({
        color: 0x93c5fd,
        dashSize: 0.1,
        gapSize: 0.05,
        transparent: true,
        opacity: 0.8
      });
      const dashed = new THREE.LineSegments(edgeGeom, dashedMat);
      dashed.computeLineDistances();
      mesh.add(dashed);
      dashedLines.push(dashed);
    }

    rootGroup.add(mesh);
    faceMeshes.push(mesh);

    const norm = normal ? normal.clone().normalize() : center.clone().normalize();
    normalVectors.push(norm);
    originalCenters.push(center);
  };

  // Switch by solidId
  switch (solidId) {
    case 'cube_platonic': {
      const a = params.a || 2.4;
      const h = a / 2;
      boundingRadius = Math.sqrt(3) * h;

      const v = [
        new THREE.Vector3(-h, -h, -h), // 0: A
        new THREE.Vector3(h, -h, -h),  // 1: B
        new THREE.Vector3(h, -h, h),   // 2: C
        new THREE.Vector3(-h, -h, h),  // 3: D
        new THREE.Vector3(-h, h, -h),  // 4: A'
        new THREE.Vector3(h, h, -h),   // 5: B'
        new THREE.Vector3(h, h, h),    // 6: C'
        new THREE.Vector3(-h, h, h)    // 7: D'
      ];
      const names = ['A', 'B', 'C', 'D', "A'", "B'", "C'", "D'"];
      v.forEach((pos, idx) => vertices.push({ id: `v${idx}`, name: names[idx], position: pos }));

      // 6 faces
      addFace([v[3], v[2], v[1], v[0]], 0, new THREE.Vector3(0, -1, 0)); // Bottom
      addFace([v[4], v[5], v[6], v[7]], 1, new THREE.Vector3(0, 1, 0));  // Top
      addFace([v[0], v[1], v[5], v[4]], 2, new THREE.Vector3(0, 0, -1)); // Front
      addFace([v[2], v[3], v[7], v[6]], 3, new THREE.Vector3(0, 0, 1));  // Back
      addFace([v[0], v[4], v[7], v[3]], 4, new THREE.Vector3(-1, 0, 0)); // Left
      addFace([v[1], v[2], v[6], v[5]], 5, new THREE.Vector3(1, 0, 0));  // Right
      break;
    }

    case 'box': {
      const a = params.a || 3.0;
      const b = params.b || 2.0;
      const c = params.c || 1.6;
      const ha = a / 2;
      const hb = c / 2; // Y is height in 3D
      const hc = b / 2; // Z is depth
      boundingRadius = Math.sqrt(ha * ha + hb * hb + hc * hc);

      const v = [
        new THREE.Vector3(-ha, -hb, -hc), // A
        new THREE.Vector3(ha, -hb, -hc),  // B
        new THREE.Vector3(ha, -hb, hc),   // C
        new THREE.Vector3(-ha, -hb, hc),  // D
        new THREE.Vector3(-ha, hb, -hc),  // A'
        new THREE.Vector3(ha, hb, -hc),   // B'
        new THREE.Vector3(ha, hb, hc),    // C'
        new THREE.Vector3(-ha, hb, hc)    // D'
      ];
      const names = ['A', 'B', 'C', 'D', "A'", "B'", "C'", "D'"];
      v.forEach((pos, idx) => vertices.push({ id: `v${idx}`, name: names[idx], position: pos }));

      addFace([v[3], v[2], v[1], v[0]], 0, new THREE.Vector3(0, -1, 0));
      addFace([v[4], v[5], v[6], v[7]], 1, new THREE.Vector3(0, 1, 0));
      addFace([v[0], v[1], v[5], v[4]], 2, new THREE.Vector3(0, 0, -1));
      addFace([v[2], v[3], v[7], v[6]], 3, new THREE.Vector3(0, 0, 1));
      addFace([v[0], v[4], v[7], v[3]], 4, new THREE.Vector3(-1, 0, 0));
      addFace([v[1], v[2], v[6], v[5]], 5, new THREE.Vector3(1, 0, 0));
      break;
    }

    case 'tetrahedron': {
      // Regular tetrahedron
      const a = params.a || 2.5;
      // Coordinates of regular tetrahedron with edge a
      const r = (a * Math.sqrt(6)) / 4;
      boundingRadius = r;
      const v0 = new THREE.Vector3(0, r, 0); // Apex S
      const hBottom = -r / 3;
      const rCirc = (a * Math.sqrt(3)) / 3;

      const v1 = new THREE.Vector3(0, hBottom, rCirc); // A
      const v2 = new THREE.Vector3(rCirc * Math.cos(Math.PI / 6), hBottom, -rCirc * Math.sin(Math.PI / 6)); // B
      const v3 = new THREE.Vector3(-rCirc * Math.cos(Math.PI / 6), hBottom, -rCirc * Math.sin(Math.PI / 6)); // C

      vertices.push({ id: 's', name: 'S', position: v0 });
      vertices.push({ id: 'a', name: 'A', position: v1 });
      vertices.push({ id: 'b', name: 'B', position: v2 });
      vertices.push({ id: 'c', name: 'C', position: v3 });

      // 4 faces
      addFace([v1, v2, v3], 0, new THREE.Vector3(0, -1, 0)); // Bottom ABC
      addFace([v0, v2, v1], 1); // SAB
      addFace([v0, v3, v2], 2); // SBC
      addFace([v0, v1, v3], 3); // SCA
      break;
    }

    case 'octahedron': {
      // 6 vertices at distance r from center
      const a = params.a || 2.2;
      const r = (a * Math.SQRT2) / 2;
      boundingRadius = r;

      const top = new THREE.Vector3(0, r, 0);    // S
      const bot = new THREE.Vector3(0, -r, 0);   // S'
      const v0 = new THREE.Vector3(r, 0, 0);     // A
      const v1 = new THREE.Vector3(0, 0, r);     // B
      const v2 = new THREE.Vector3(-r, 0, 0);    // C
      const v3 = new THREE.Vector3(0, 0, -r);    // D

      vertices.push({ id: 's', name: 'S', position: top });
      vertices.push({ id: 'sp', name: "S'", position: bot });
      vertices.push({ id: 'a', name: 'A', position: v0 });
      vertices.push({ id: 'b', name: 'B', position: v1 });
      vertices.push({ id: 'c', name: 'C', position: v2 });
      vertices.push({ id: 'd', name: 'D', position: v3 });

      // Top 4 faces
      addFace([top, v0, v1], 0);
      addFace([top, v1, v2], 1);
      addFace([top, v2, v3], 2);
      addFace([top, v3, v0], 3);
      // Bottom 4 faces
      addFace([bot, v1, v0], 4);
      addFace([bot, v2, v1], 5);
      addFace([bot, v3, v2], 6);
      addFace([bot, v0, v3], 7);
      break;
    }

    case 'dodecahedron': {
      const a = params.a || 1.6;
      // Use Three.js DodecahedronGeometry to extract faces and vertices cleanly
      // Radius corresponding to edge a: R_circum = a * (sqrt(3) + sqrt(15)) / 4 ≈ a * 1.4012585
      const rad = a * 1.4012585;
      boundingRadius = rad;
      const baseGeom = new THREE.DodecahedronGeometry(rad);
      const posAttr = baseGeom.getAttribute('position');

      // Group triangles by face normal to reconstruct 12 pentagons
      const triangleNormals: THREE.Vector3[] = [];
      const triangleVertices: THREE.Vector3[][] = [];

      for (let i = 0; i < posAttr.count; i += 3) {
        const p1 = new THREE.Vector3().fromBufferAttribute(posAttr, i);
        const p2 = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
        const p3 = new THREE.Vector3().fromBufferAttribute(posAttr, i + 2);
        const cb = new THREE.Vector3().subVectors(p3, p2);
        const ab = new THREE.Vector3().subVectors(p1, p2);
        const normal = new THREE.Vector3().crossVectors(cb, ab).normalize();
        triangleNormals.push(normal);
        triangleVertices.push([p1, p2, p3]);
      }

      // Cluster faces by similar normals
      const clusters: { normal: THREE.Vector3; tris: THREE.Vector3[][] }[] = [];
      triangleNormals.forEach((n, idx) => {
        let found = clusters.find((c) => c.normal.dot(n) > 0.95);
        if (!found) {
          found = { normal: n.clone(), tris: [] };
          clusters.push(found);
        }
        found.tris.push(triangleVertices[idx]);
      });

      // Extract unique vertices
      const uniqueVerts: THREE.Vector3[] = [];
      for (let i = 0; i < posAttr.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(posAttr, i);
        if (!uniqueVerts.some((u) => u.distanceTo(p) < 0.05)) {
          uniqueVerts.push(p);
        }
      }
      uniqueVerts.forEach((p, idx) => {
        if (idx < 20) {
          vertices.push({ id: `d${idx}`, name: `V${idx + 1}`, position: p });
        }
      });

      clusters.forEach((cl, cIdx) => {
        const geom = new THREE.BufferGeometry();
        const positions: number[] = [];
        const center = new THREE.Vector3();
        let ptCount = 0;

        cl.tris.forEach(([p1, p2, p3]) => {
          positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
          center.add(p1).add(p2).add(p3);
          ptCount += 3;
        });
        center.divideScalar(ptCount);

        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.computeVertexNormals();

        const color = style === 'pbr' ? 0x2563eb : FACE_PALETTE[cIdx % FACE_PALETTE.length];
        const mat = createMaterial(style, color, clippingPlanes);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const edgeGeom = new THREE.EdgesGeometry(geom, 20);
        const edgeLine = new THREE.LineSegments(
          edgeGeom,
          new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1.5, clippingPlanes: clippingPlanes || [] })
        );
        mesh.add(edgeLine);
        edgeLines.push(edgeLine);

        rootGroup.add(mesh);
        faceMeshes.push(mesh);
        normalVectors.push(cl.normal.clone());
        originalCenters.push(center);
      });
      break;
    }

    case 'icosahedron': {
      const a = params.a || 1.6;
      // Radius: R = a * sin(2*pi/5) ≈ a * 0.9510565
      const rad = a * 0.9510565;
      boundingRadius = rad;
      const baseGeom = new THREE.IcosahedronGeometry(rad);
      const posAttr = baseGeom.getAttribute('position');

      // 20 triangular faces
      for (let i = 0; i < posAttr.count; i += 3) {
        const p1 = new THREE.Vector3().fromBufferAttribute(posAttr, i);
        const p2 = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
        const p3 = new THREE.Vector3().fromBufferAttribute(posAttr, i + 2);
        addFace([p1, p2, p3], i / 3);
      }

      // Unique 12 vertices
      const uniqueVerts: THREE.Vector3[] = [];
      for (let i = 0; i < posAttr.count; i++) {
        const p = new THREE.Vector3().fromBufferAttribute(posAttr, i);
        if (!uniqueVerts.some((u) => u.distanceTo(p) < 0.05)) {
          uniqueVerts.push(p);
        }
      }
      uniqueVerts.forEach((p, idx) => {
        if (idx < 12) {
          vertices.push({ id: `ico_${idx}`, name: `V${idx + 1}`, position: p });
        }
      });
      break;
    }

    case 'pyramid_square': {
      const a = params.a || 2.6;
      const h = params.h || 2.8;
      const ha = a / 2;
      const halfH = h / 2;
      boundingRadius = Math.sqrt(ha * ha + h * h);

      const S = new THREE.Vector3(0, halfH, 0);
      const A = new THREE.Vector3(-ha, -halfH, -ha);
      const B = new THREE.Vector3(ha, -halfH, -ha);
      const C = new THREE.Vector3(ha, -halfH, ha);
      const D = new THREE.Vector3(-ha, -halfH, ha);

      vertices.push({ id: 's', name: 'S', position: S });
      vertices.push({ id: 'a', name: 'A', position: A });
      vertices.push({ id: 'b', name: 'B', position: B });
      vertices.push({ id: 'c', name: 'C', position: C });
      vertices.push({ id: 'd', name: 'D', position: D });

      // Base ABCD
      addFace([D, C, B, A], 0, new THREE.Vector3(0, -1, 0));
      // 4 side faces
      addFace([S, A, B], 1);
      addFace([S, B, C], 2);
      addFace([S, C, D], 3);
      addFace([S, D, A], 4);
      break;
    }

    case 'prism_triangular': {
      const a = params.a || 2.2;
      const h = params.h || 2.8;
      const halfH = h / 2;
      const rCirc = (a * Math.sqrt(3)) / 3;
      boundingRadius = Math.sqrt(rCirc * rCirc + halfH * halfH);

      // Bottom triangle ABC
      const A = new THREE.Vector3(0, -halfH, rCirc);
      const B = new THREE.Vector3(rCirc * Math.cos(Math.PI / 6), -halfH, -rCirc * Math.sin(Math.PI / 6));
      const C = new THREE.Vector3(-rCirc * Math.cos(Math.PI / 6), -halfH, -rCirc * Math.sin(Math.PI / 6));

      // Top triangle A'B'C'
      const Ap = new THREE.Vector3(0, halfH, rCirc);
      const Bp = new THREE.Vector3(rCirc * Math.cos(Math.PI / 6), halfH, -rCirc * Math.sin(Math.PI / 6));
      const Cp = new THREE.Vector3(-rCirc * Math.cos(Math.PI / 6), halfH, -rCirc * Math.sin(Math.PI / 6));

      vertices.push({ id: 'a', name: 'A', position: A });
      vertices.push({ id: 'b', name: 'B', position: B });
      vertices.push({ id: 'c', name: 'C', position: C });
      vertices.push({ id: 'ap', name: "A'", position: Ap });
      vertices.push({ id: 'bp', name: "B'", position: Bp });
      vertices.push({ id: 'cp', name: "C'", position: Cp });

      // Bottom and Top
      addFace([A, C, B], 0, new THREE.Vector3(0, -1, 0));
      addFace([Ap, Bp, Cp], 1, new THREE.Vector3(0, 1, 0));
      // 3 sides
      addFace([A, B, Bp, Ap], 2);
      addFace([B, C, Cp, Bp], 3);
      addFace([C, A, Ap, Cp], 4);
      break;
    }

    case 'cylinder': {
      const r = params.r || 1.5;
      const h = params.h || 3.0;
      boundingRadius = Math.sqrt(r * r + (h / 2) * (h / 2));

      // Build 3 distinct parts: Bottom disk, Top disk, Lateral surface
      const halfH = h / 2;

      // Bottom disk
      const botDisk = new THREE.CircleGeometry(r, 48);
      botDisk.rotateX(Math.PI / 2);
      botDisk.translate(0, -halfH, 0);
      const botMat = createMaterial(style, style === 'pbr' ? 0x2563eb : FACE_PALETTE[0], clippingPlanes);
      const botMesh = new THREE.Mesh(botDisk, botMat);
      botMesh.castShadow = true;
      botMesh.receiveShadow = true;
      rootGroup.add(botMesh);
      faceMeshes.push(botMesh);
      normalVectors.push(new THREE.Vector3(0, -1, 0));
      originalCenters.push(new THREE.Vector3(0, -halfH, 0));

      // Top disk
      const topDisk = new THREE.CircleGeometry(r, 48);
      topDisk.rotateX(-Math.PI / 2);
      topDisk.translate(0, halfH, 0);
      const topMat = createMaterial(style, style === 'pbr' ? 0x2563eb : FACE_PALETTE[1], clippingPlanes);
      const topMesh = new THREE.Mesh(topDisk, topMat);
      topMesh.castShadow = true;
      topMesh.receiveShadow = true;
      rootGroup.add(topMesh);
      faceMeshes.push(topMesh);
      normalVectors.push(new THREE.Vector3(0, 1, 0));
      originalCenters.push(new THREE.Vector3(0, halfH, 0));

      // Lateral tube
      const latGeom = new THREE.CylinderGeometry(r, r, h, 48, 1, true);
      const latMat = createMaterial(style, style === 'pbr' ? 0x3b82f6 : FACE_PALETTE[2], clippingPlanes);
      const latMesh = new THREE.Mesh(latGeom, latMat);
      latMesh.castShadow = true;
      latMesh.receiveShadow = true;
      rootGroup.add(latMesh);
      faceMeshes.push(latMesh);
      normalVectors.push(new THREE.Vector3(0, 0, 0));
      originalCenters.push(new THREE.Vector3(0, 0, 0));

      // Circular edge outlines
      const botEdges = new THREE.EdgesGeometry(botDisk);
      const botLine = new THREE.LineSegments(botEdges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, clippingPlanes: clippingPlanes || [] }));
      botMesh.add(botLine);
      edgeLines.push(botLine);

      const topEdges = new THREE.EdgesGeometry(topDisk);
      const topLine = new THREE.LineSegments(topEdges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, clippingPlanes: clippingPlanes || [] }));
      topMesh.add(topLine);
      edgeLines.push(topLine);

      // Centers for markers
      vertices.push({ id: 'o1', name: "O'", position: new THREE.Vector3(0, halfH, 0) });
      vertices.push({ id: 'o2', name: 'O', position: new THREE.Vector3(0, -halfH, 0) });
      vertices.push({ id: 'a', name: 'A', position: new THREE.Vector3(r, -halfH, 0) });
      vertices.push({ id: 'ap', name: "A'", position: new THREE.Vector3(r, halfH, 0) });
      break;
    }

    case 'cone': {
      const r = params.r || 1.8;
      const h = params.h || 3.0;
      const halfH = h / 2;
      boundingRadius = Math.sqrt(r * r + halfH * halfH);

      // Bottom disk
      const botDisk = new THREE.CircleGeometry(r, 48);
      botDisk.rotateX(Math.PI / 2);
      botDisk.translate(0, -halfH, 0);
      const botMat = createMaterial(style, style === 'pbr' ? 0x2563eb : FACE_PALETTE[0], clippingPlanes);
      const botMesh = new THREE.Mesh(botDisk, botMat);
      botMesh.castShadow = true;
      botMesh.receiveShadow = true;
      rootGroup.add(botMesh);
      faceMeshes.push(botMesh);
      normalVectors.push(new THREE.Vector3(0, -1, 0));
      originalCenters.push(new THREE.Vector3(0, -halfH, 0));

      const botEdges = new THREE.EdgesGeometry(botDisk);
      const botLine = new THREE.LineSegments(botEdges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, clippingPlanes: clippingPlanes || [] }));
      botMesh.add(botLine);
      edgeLines.push(botLine);

      // Lateral cone surface (open bottom)
      const latGeom = new THREE.ConeGeometry(r, h, 48, 1, true);
      const latMat = createMaterial(style, style === 'pbr' ? 0xec4899 : FACE_PALETTE[1], clippingPlanes);
      const latMesh = new THREE.Mesh(latGeom, latMat);
      latMesh.castShadow = true;
      latMesh.receiveShadow = true;
      rootGroup.add(latMesh);
      faceMeshes.push(latMesh);
      normalVectors.push(new THREE.Vector3(0, 0.5, 0));
      originalCenters.push(new THREE.Vector3(0, 0, 0));

      // Key vertices: Apex S, Base Center O, boundary points
      vertices.push({ id: 's', name: 'S', position: new THREE.Vector3(0, halfH, 0) });
      vertices.push({ id: 'o', name: 'O', position: new THREE.Vector3(0, -halfH, 0) });
      vertices.push({ id: 'a', name: 'A', position: new THREE.Vector3(r, -halfH, 0) });
      vertices.push({ id: 'b', name: 'B', position: new THREE.Vector3(-r, -halfH, 0) });
      break;
    }

    case 'sphere': {
      const R = params.R || 2.0;
      boundingRadius = R;

      const sphereGeom = new THREE.SphereGeometry(R, 48, 36);
      const mat = createMaterial(style, 0x06b6d4, clippingPlanes);
      const mesh = new THREE.Mesh(sphereGeom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      rootGroup.add(mesh);
      faceMeshes.push(mesh);
      normalVectors.push(new THREE.Vector3(0, 0, 0));
      originalCenters.push(new THREE.Vector3(0, 0, 0));

      // Add equatorial & meridian rings for geometric clarity
      const eqRingGeom = new THREE.RingGeometry(R * 0.998, R * 1.002, 64);
      eqRingGeom.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
      const eqRing = new THREE.Mesh(eqRingGeom, ringMat);
      mesh.add(eqRing);

      const merRingGeom = new THREE.RingGeometry(R * 0.998, R * 1.002, 64);
      const merRing = new THREE.Mesh(merRingGeom, ringMat);
      mesh.add(merRing);

      vertices.push({ id: 'o', name: 'O', position: new THREE.Vector3(0, 0, 0) });
      vertices.push({ id: 'n', name: 'N (Bắc)', position: new THREE.Vector3(0, R, 0) });
      vertices.push({ id: 's', name: 'S (Nam)', position: new THREE.Vector3(0, -R, 0) });
      vertices.push({ id: 'a', name: 'A', position: new THREE.Vector3(R, 0, 0) });
      break;
    }

    case 'truncated_cone': {
      const r1 = params.r1 || 2.2; // bottom
      const r2 = params.r2 || 1.0; // top
      const h = params.h || 2.6;
      const halfH = h / 2;
      boundingRadius = Math.sqrt(r1 * r1 + halfH * halfH);

      // Bottom disk
      const botDisk = new THREE.CircleGeometry(r1, 48);
      botDisk.rotateX(Math.PI / 2);
      botDisk.translate(0, -halfH, 0);
      const botMat = createMaterial(style, style === 'pbr' ? 0x2563eb : FACE_PALETTE[0], clippingPlanes);
      const botMesh = new THREE.Mesh(botDisk, botMat);
      botMesh.castShadow = true;
      rootGroup.add(botMesh);
      faceMeshes.push(botMesh);
      normalVectors.push(new THREE.Vector3(0, -1, 0));
      originalCenters.push(new THREE.Vector3(0, -halfH, 0));

      const botEdges = new THREE.EdgesGeometry(botDisk);
      const botLine = new THREE.LineSegments(botEdges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, clippingPlanes: clippingPlanes || [] }));
      botMesh.add(botLine);
      edgeLines.push(botLine);

      // Top disk
      const topDisk = new THREE.CircleGeometry(r2, 48);
      topDisk.rotateX(-Math.PI / 2);
      topDisk.translate(0, halfH, 0);
      const topMat = createMaterial(style, style === 'pbr' ? 0x2563eb : FACE_PALETTE[1], clippingPlanes);
      const topMesh = new THREE.Mesh(topDisk, topMat);
      topMesh.castShadow = true;
      rootGroup.add(topMesh);
      faceMeshes.push(topMesh);
      normalVectors.push(new THREE.Vector3(0, 1, 0));
      originalCenters.push(new THREE.Vector3(0, halfH, 0));

      const topEdges = new THREE.EdgesGeometry(topDisk);
      const topLine = new THREE.LineSegments(topEdges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, clippingPlanes: clippingPlanes || [] }));
      topMesh.add(topLine);
      edgeLines.push(topLine);

      // Lateral truncated cylinder/cone
      const latGeom = new THREE.CylinderGeometry(r2, r1, h, 48, 1, true);
      const latMat = createMaterial(style, style === 'pbr' ? 0x8b5cf6 : FACE_PALETTE[2], clippingPlanes);
      const latMesh = new THREE.Mesh(latGeom, latMat);
      latMesh.castShadow = true;
      rootGroup.add(latMesh);
      faceMeshes.push(latMesh);
      normalVectors.push(new THREE.Vector3(0, 0, 0));
      originalCenters.push(new THREE.Vector3(0, 0, 0));

      vertices.push({ id: 'o_top', name: "O'", position: new THREE.Vector3(0, halfH, 0) });
      vertices.push({ id: 'o_bot', name: 'O', position: new THREE.Vector3(0, -halfH, 0) });
      vertices.push({ id: 'a_bot', name: 'A', position: new THREE.Vector3(r1, -halfH, 0) });
      vertices.push({ id: 'a_top', name: "A'", position: new THREE.Vector3(r2, halfH, 0) });
      break;
    }
  }

  return {
    group: rootGroup,
    vertices,
    faceMeshes,
    edgeLines,
    dashedLines,
    normalVectors,
    originalCenters,
    boundingRadius,
  };
}
