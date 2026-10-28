import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const canvas = document.createElement('canvas');
  canvas.className = 'city-webgl';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const heroSection = document.querySelector('.hero-banner');
  if (heroSection) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      document.body.classList.toggle('hero-city-visible', entry.isIntersecting);
    }, {threshold:0.05});
    heroObserver.observe(heroSection);
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !mobile,
      powerPreference: 'low-power'
    });
  } catch (error) {
    canvas.remove();
    console.error('Three.js city background could not initialize WebGL.', error);
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x071329, 0.018);
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 180);
  camera.position.set(0, 9, 34);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0x8deaff, 0x080c20, 1.55));
  const keyLight = new THREE.DirectionalLight(0x84d9ff, 2.5);
  keyLight.position.set(-12, 22, 16);
  keyLight.castShadow = !mobile;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -32;
  keyLight.shadow.camera.right = 32;
  keyLight.shadow.camera.top = 24;
  keyLight.shadow.camera.bottom = -24;
  keyLight.shadow.camera.far = 90;
  scene.add(keyLight);
  const violetLight = new THREE.PointLight(0x765cff, 38, 50, 2);
  violetLight.position.set(12, 3, -4);
  scene.add(violetLight);
  const cyanLight = new THREE.PointLight(0x21d9ff, 45, 42, 2);
  cyanLight.position.set(-10, 1, 10);
  scene.add(cyanLight);

  const materials = {
    tower: new THREE.MeshStandardMaterial({color:0x101d35, metalness:.82, roughness:.29}),
    towerAlt: new THREE.MeshStandardMaterial({color:0x182844, metalness:.74, roughness:.34}),
    platform: new THREE.MeshStandardMaterial({color:0x0c1830, metalness:.9, roughness:.24}),
    cyan: new THREE.MeshStandardMaterial({color:0x41dfff, emissive:0x0a9ec4, emissiveIntensity:1.8, metalness:.4, roughness:.2}),
    blue: new THREE.MeshStandardMaterial({color:0x477eff, emissive:0x273fdb, emissiveIntensity:1.35, metalness:.48, roughness:.24}),
    violet: new THREE.MeshStandardMaterial({color:0x9b7cff, emissive:0x5636c8, emissiveIntensity:1.5, metalness:.38, roughness:.2}),
    glass: new THREE.MeshStandardMaterial({color:0x18355c, emissive:0x082447, emissiveIntensity:.8, metalness:.55, roughness:.16, transparent:true, opacity:.88}),
    core: new THREE.MeshStandardMaterial({color:0x9ff8ff, emissive:0x22cfff, emissiveIntensity:3.4, metalness:.1, roughness:.12})
  };

  const city = new THREE.Group();
  city.position.z = -4;
  city.scale.setScalar(.9);
  scene.add(city);
  const floaters = [];
  const rotators = [];
  const streamDots = [];

  function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }
  const random = seededRandom(41227);

  function makeMesh(geometry, material, parent, position, rotation) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.castShadow = !mobile;
    mesh.receiveShadow = !mobile;
    parent.add(mesh);
    return mesh;
  }

  const sharedBox = new THREE.BoxGeometry(1, 1, 1);
  const sharedEdge = new THREE.BoxGeometry(1, 1, 1);
  const sharedRing = new THREE.TorusGeometry(1, .035, 8, 56);

  function addTower(parent, x, z, width, depth, height, index) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    parent.add(group);
    const body = makeMesh(sharedBox, index % 3 === 0 ? materials.towerAlt : materials.tower, group,
      [0, height / 2, 0], [0, (random() - .5) * .16, 0]);
    body.scale.set(width, height, depth);

    const cap = makeMesh(sharedBox, index % 4 === 0 ? materials.violet : materials.platform, group,
      [0, height + .12, 0]);
    cap.scale.set(width * 1.12, .22, depth * 1.12);

    const edgeMaterial = index % 4 === 0 ? materials.violet : materials.cyan;
    for (const side of [-1, 1]) {
      const edge = makeMesh(sharedEdge, edgeMaterial, group,
        [side * width * .46, height * .5, depth * .51]);
      edge.scale.set(.045, height * .92, .035);
      const bandCount = Math.min(5, Math.max(2, Math.floor(height / 1.8)));
      for (let band = 1; band <= bandCount; band++) {
        const strip = makeMesh(sharedEdge, band % 3 === 0 ? materials.blue : materials.cyan, group,
          [0, height * band / (bandCount + 1), depth * .505]);
        strip.scale.set(width * .68, .035, .025);
      }
    }
    if (index % 5 === 0) {
      const antenna = makeMesh(new THREE.CylinderGeometry(.025, .04, height * .28, 6), materials.blue, group,
        [0, height + height * .14, 0]);
      antenna.castShadow = false;
    }
  }

  const islandSpecs = mobile
    ? [[-7,-5,0,0],[0,-8,-4,1],[7,-4,-2,2],[0,5,-12,3]]
    : [[-13,-5,0,0],[-5,-9,-6,1],[4,-7,-2,2],[13,-4,-7,3],[0,7,-15,4]];
  islandSpecs.forEach((spec, islandIndex) => {
    const [x, z, yaw, seed] = spec;
    const island = new THREE.Group();
    island.position.set(x, -2.5 + (islandIndex % 2) * .8, z);
    island.rotation.y = yaw * .2;
    city.add(island);
    floaters.push({object:island, baseY:island.position.y, phase:islandIndex * 1.35, amplitude:.22});

    const radius = mobile ? 3.8 : 4.5 + random() * 1.5;
    const slab = makeMesh(new THREE.CylinderGeometry(radius * 1.15, radius, .48, 6, 1), materials.platform, island, [0,0,0], [0,Math.PI / 6,0]);
    slab.receiveShadow = !mobile;
    const underglow = makeMesh(new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, .1, 6, 1), materials.blue, island, [0,-.3,0], [0,Math.PI / 6,0]);
    underglow.material = materials.blue;
    const rim = makeMesh(new THREE.TorusGeometry(radius * 1.05, .045, 8, 6), materials.cyan, island, [0,-.18,0], [Math.PI / 2,0,Math.PI / 6]);
    rim.scale.set(1,1,.92);

    const count = mobile ? 3 : 4 + Math.floor(random() * 3);
    for (let towerIndex = 0; towerIndex < count; towerIndex++) {
      const angle = (towerIndex / count) * Math.PI * 2 + random() * .4;
      const spread = radius * (.18 + random() * .57);
      const h = (mobile ? 3.2 : 4.2) + random() * (mobile ? 6.2 : 10);
      addTower(island, Math.cos(angle) * spread, Math.sin(angle) * spread, .8 + random() * 1.15, .8 + random() * 1.1, h, seed + towerIndex);
    }

    if (!mobile || islandIndex === 1) {
      const ringPivot = new THREE.Group();
      ringPivot.position.set(0, 1.3, 0);
      island.add(ringPivot);
      const ring = makeMesh(sharedRing, materials.violet, ringPivot, [0,0,0], [.3, .2, .1]);
      ring.scale.set(radius * .72, radius * .72, 1);
      rotators.push({object:ringPivot, axis:'y', speed:.18 + islandIndex * .025});
    }

    if (islandIndex === 2 || (mobile && islandIndex === 1)) {
      const coreGroup = new THREE.Group();
      coreGroup.position.set(0, 1.6, 0);
      island.add(coreGroup);
      const core = makeMesh(new THREE.IcosahedronGeometry(.72, 2), materials.core, coreGroup, [0,0,0]);
      core.scale.set(.72, 1.3, .72);
      const halo = makeMesh(new THREE.TorusGeometry(1.15, .035, 8, 48), materials.cyan, coreGroup, [0,0,0], [Math.PI/2,0,0]);
      const halo2 = makeMesh(new THREE.TorusGeometry(1.45, .025, 8, 48), materials.violet, coreGroup, [0,0,0], [.45,0,.5]);
      rotators.push({object:coreGroup, axis:'y', speed:.42});
      rotators.push({object:halo, axis:'z', speed:.55});
      rotators.push({object:halo2, axis:'x', speed:-.32});
      floaters.push({object:core, baseY:0, phase:islandIndex, amplitude:.14});
    }
  });

  const arch = new THREE.Group();
  arch.position.set(0, 2.8, -10);
  city.add(arch);
  const archRing = makeMesh(new THREE.TorusGeometry(3.3, .11, 10, 64), materials.blue, arch, [0,0,0], [Math.PI / 2,0,0]);
  const archInner = makeMesh(new THREE.TorusGeometry(2.45, .035, 8, 64), materials.cyan, arch, [0,0,0], [.25,0,0]);
  rotators.push({object:arch, axis:'y', speed:.11});

  function addEnergyStream(start, end, material, count) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(start[0], start[1], start[2]),
      new THREE.Vector3(start[0] * .35, start[1] + 2.5, (start[2] + end[2]) / 2),
      new THREE.Vector3(end[0] * .35, end[1] + 2.5, (start[2] + end[2]) / 2),
      new THREE.Vector3(end[0], end[1], end[2])
    ]);
    const streamMaterial = material.clone();
    streamMaterial.transparent = true;
    streamMaterial.opacity = .55;
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, .018, 5, false), streamMaterial);
    city.add(tube);
    for (let i = 0; i < count; i++) {
      const dot = makeMesh(new THREE.SphereGeometry(.055, 6, 6), material, city, [0,0,0]);
      streamDots.push({object:dot, curve, progress:i / count, speed:.035 + (i % 3) * .006});
    }
  }
  if (!mobile) {
    addEnergyStream([-15,1,2], [7,1,-2], materials.cyan, 7);
    addEnergyStream([-6,0,-5], [14,0,-7], materials.violet, 6);
  } else {
    addEnergyStream([-7,0,0], [7,0,-3], materials.cyan, 4);
  }

  const particleCount = mobile ? 220 : 780;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleDrift = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (random() - .5) * 46;
    particlePositions[i * 3 + 1] = random() * 25 - 9;
    particlePositions[i * 3 + 2] = (random() - .5) * 54 - 5;
    particleDrift[i] = .12 + random() * .38;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color:0x83dfff, size:mobile ? .075 : .09, transparent:true, opacity:.72,
    blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true
  });
  scene.add(new THREE.Points(particleGeometry, particleMaterial));

  const pointer = new THREE.Vector2();
  const targetCamera = new THREE.Vector2();
  const clock = new THREE.Clock();
  let frameId = 0;
  let scrollSmooth = 0;
  let isVisible = !document.hidden;

  function onPointerMove(event) {
    if (coarsePointer) return;
    targetCamera.x = (event.clientX / window.innerWidth - .5) * 1.7;
    targetCamera.y = (event.clientY / window.innerHeight - .5) * .8;
  }
  window.addEventListener('pointermove', onPointerMove, {passive:true});
  window.addEventListener('pointerleave', () => targetCamera.set(0, 0), {passive:true});

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', resize, {passive:true});
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible && !reduceMotion) start();
    else if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  });

  function render() {
    frameId = 0;
    if (!isVisible) return;
    const delta = Math.min(clock.getDelta(), .04);
    const elapsed = clock.elapsedTime;
    pointer.lerp(targetCamera, 1 - Math.exp(-delta * 2.2));
    const scrollOffset = (window.scrollY / Math.max(document.documentElement.scrollHeight, 1)) * 1.5;

    /* scroll-driven 3D: the whole city orbits, drifts and zooms as the page scrolls */
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const scrollTarget = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    scrollSmooth += (scrollTarget - scrollSmooth) * (1 - Math.exp(-delta * 3));
    if (!reduceMotion) {
      city.rotation.y = scrollSmooth * Math.PI * 1.6;
      city.position.x = Math.sin(scrollSmooth * Math.PI * 2) * (mobile ? 1.8 : 3);
      city.rotation.x = Math.sin(scrollSmooth * Math.PI * 3) * .06;
    }
    const zoom = 34 - Math.sin(scrollSmooth * Math.PI) * (mobile ? 7 : 5);
    camera.position.z += (zoom - camera.position.z) * (1 - Math.exp(-delta * 1.4));
    /* touch devices have no cursor, so give them a slow idle sway instead */
    const idleSway = coarsePointer && !reduceMotion ? Math.sin(elapsed * .22) * 1.4 : 0;

    camera.position.x += (pointer.x * 3 + idleSway - camera.position.x) * (1 - Math.exp(-delta * 1.4));
    camera.position.y += (9 - pointer.y * 2.2 - scrollOffset - camera.position.y) * (1 - Math.exp(-delta * 1.4));
    camera.lookAt(pointer.x * 1.4, -1 + pointer.y * .4, -2);

    if (!reduceMotion) {
      floaters.forEach(item => {
        item.object.position.y = item.baseY + Math.sin(elapsed * .62 + item.phase) * item.amplitude;
      });
      rotators.forEach(item => { item.object.rotation[item.axis] += item.speed * delta; });
      for (let i = 0; i < particleCount; i++) {
        const yIndex = i * 3 + 1;
        particlePositions[yIndex] += particleDrift[i] * delta;
        if (particlePositions[yIndex] > 17) particlePositions[yIndex] = -9;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      streamDots.forEach(item => {
        item.progress = (item.progress + item.speed * delta) % 1;
        item.curve.getPointAt(item.progress, item.object.position);
      });
    }
    renderer.render(scene, camera);
    if (!reduceMotion) frameId = requestAnimationFrame(render);
  }

  function start() {
    if (!frameId && isVisible && !reduceMotion) frameId = requestAnimationFrame(render);
  }
  if (reduceMotion) render();
  else start();
})();