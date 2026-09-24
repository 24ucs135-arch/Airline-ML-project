/**
 * 3D Neural Constellation & Geometric Cyber Core
 * Powered by Three.js
 * Author: Shanmugappriya M Portfolio
 */

(function () {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable()) {
    console.warn('WebGL is not available in your browser.');
    return;
  }

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06070d, 0.0018);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 180;
  camera.position.y = 10;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle Constellation Configuration
  const particleCount = 420;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = [];

  const cyanColor = new THREE.Color(0x00f0ff);
  const purpleColor = new THREE.Color(0x8b5cf6);
  const pinkColor = new THREE.Color(0xec4899);

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 450;
    const y = (Math.random() - 0.5) * 450;
    const z = (Math.random() - 0.5) * 350;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Gradient color variation
    const mixRatio = Math.random();
    let pColor = cyanColor.clone();
    if (mixRatio > 0.6) {
      pColor.lerp(purpleColor, Math.random());
    } else if (mixRatio > 0.85) {
      pColor.lerp(pinkColor, Math.random());
    }

    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;

    velocities.push({
      x: (Math.random() - 0.5) * 0.12,
      y: (Math.random() - 0.5) * 0.12,
      z: (Math.random() - 0.5) * 0.12
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular glow texture for particles
  function createParticleTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.8)');
    grad.addColorStop(0.7, 'rgba(139, 92, 246, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(pCanvas);
  }

  const pMaterial = new THREE.PointsMaterial({
    size: 4.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    map: createParticleTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, pMaterial);
  scene.add(particleSystem);

  // Dynamic Synapse Connection Lines
  const maxConnections = particleCount * 4;
  const linePositions = new Float32Array(maxConnections * 6);
  const lineColors = new Float32Array(maxConnections * 6);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineSegments);

  // Geometric Cyber Core - 3D Wireframe Icosahedron & Inner Glowing Sphere
  const coreGroup = new THREE.Group();
  coreGroup.position.set(70, 0, -20); // Positioned nicely near hero visual area

  // Outer wireframe icosahedron
  const icoGeometry = new THREE.IcosahedronGeometry(28, 1);
  const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
  coreGroup.add(icoMesh);

  // Middle dodecahedron
  const dodGeometry = new THREE.DodecahedronGeometry(18, 0);
  const dodMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  const dodMesh = new THREE.Mesh(dodGeometry, dodMaterial);
  coreGroup.add(dodMesh);

  // Inner core sphere
  const innerSphereGeo = new THREE.SphereGeometry(7, 16, 16);
  const innerSphereMat = new THREE.MeshBasicMaterial({
    color: 0xec4899,
    wireframe: false,
    transparent: true,
    opacity: 0.8
  });
  const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
  coreGroup.add(innerSphere);

  // Outer orbiting rings
  const ringGeo = new THREE.TorusGeometry(38, 0.4, 8, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.35
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 3;
  coreGroup.add(ringMesh);

  scene.add(coreGroup);

  // Ambient point lights for subtle depth
  const cyanLight = new THREE.PointLight(0x00f0ff, 1.5, 300);
  cyanLight.position.set(-80, 50, 60);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x8b5cf6, 1.5, 300);
  purpleLight.position.set(100, -60, 60);
  scene.add(purpleLight);

  // Mouse & Scroll Tracking
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let scrollProgress = 0;

  window.addEventListener('mousemove', function (e) {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.06;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.06;
  }, { passive: true });

  window.addEventListener('scroll', function () {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }, { passive: true });

  // Responsive Resizing
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Shift cyber core position for smaller screens
    if (window.innerWidth < 992) {
      coreGroup.position.set(0, 30, -50);
      coreGroup.scale.set(0.7, 0.7, 0.7);
    } else {
      coreGroup.position.set(70, 0, -20);
      coreGroup.scale.set(1, 1, 1);
    }
  });

  // Initial screen size adjustment
  if (window.innerWidth < 992) {
    coreGroup.position.set(0, 30, -50);
    coreGroup.scale.set(0.7, 0.7, 0.7);
  }

  // Animation Loop
  let frame = 0;
  const connectionDistance = 55;

  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Mouse smoothing (lerp)
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Camera motion tied to mouse and scroll
    camera.position.x = mouseX * 0.8;
    camera.position.y = 10 - mouseY * 0.8 - scrollProgress * 50;
    camera.lookAt(0, -scrollProgress * 40, 0);

    // Rotate core structure
    icoMesh.rotation.x += 0.003;
    icoMesh.rotation.y += 0.005;
    dodMesh.rotation.x -= 0.004;
    dodMesh.rotation.y += 0.006;
    ringMesh.rotation.z += 0.004;
    innerSphere.scale.setScalar(1 + Math.sin(frame * 0.05) * 0.15);

    // Float cyber core slightly
    coreGroup.position.y = (window.innerWidth < 992 ? 30 : 0) + Math.sin(frame * 0.02) * 5;

    // Update particle positions and line connections
    const pos = geometry.attributes.position.array;
    let lineIdx = 0;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      // Bounce boundaries
      if (Math.abs(pos[i * 3]) > 220) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 220) velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 180) velocities[i].z *= -1;

      // Connect near neighbors
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectionDistance && lineIdx < maxConnections) {
          const alpha = 1.0 - dist / connectionDistance;

          linePositions[lineIdx * 6] = pos[i * 3];
          linePositions[lineIdx * 6 + 1] = pos[i * 3 + 1];
          linePositions[lineIdx * 6 + 2] = pos[i * 3 + 2];

          linePositions[lineIdx * 6 + 3] = pos[j * 3];
          linePositions[lineIdx * 6 + 4] = pos[j * 3 + 1];
          linePositions[lineIdx * 6 + 5] = pos[j * 3 + 2];

          // Line color fades with distance
          lineColors[lineIdx * 6] = 0.0 * alpha;
          lineColors[lineIdx * 6 + 1] = 0.94 * alpha;
          lineColors[lineIdx * 6 + 2] = 1.0 * alpha;

          lineColors[lineIdx * 6 + 3] = 0.54 * alpha;
          lineColors[lineIdx * 6 + 4] = 0.36 * alpha;
          lineColors[lineIdx * 6 + 5] = 0.96 * alpha;

          lineIdx++;
        }
      }
    }

    geometry.attributes.position.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineIdx * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;

    // Slow rotation of entire particle cloud
    particleSystem.rotation.y = frame * 0.0006;
    lineSegments.rotation.y = frame * 0.0006;

    renderer.render(scene, camera);
  }

  animate();
})();
