document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Animate hamburger to X (optional simple CSS toggle could be added)
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Three.js 3D Animation
    init3D();
});

function init3D() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // GEOMETRY - PROCEDURAL KEY / LOCK ABSTRACT 
    // We will create a simple group of shapes to resemble a floating, futuristic lock cylinder
    const group = new THREE.Group();

    // Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.7,
        roughness: 0.2
    });

    const darkMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.5,
        roughness: 0.5
    });

    // Core Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    const cylinder = new THREE.Mesh(cylinderGeo, darkMaterial);
    cylinder.rotation.x = Math.PI / 2;
    group.add(cylinder);

    // Outer Ring (The "Lock" face)
    const ringGeo = new THREE.TorusGeometry(1.2, 0.2, 16, 100);
    const ring = new THREE.Mesh(ringGeo, goldMaterial);
    group.add(ring);

    // Pins/Details floating around
    for (let i = 0; i < 5; i++) {
        const pinGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
        const pin = new THREE.Mesh(pinGeo, goldMaterial);
        pin.position.set(Math.cos(i) * 1.5, Math.sin(i) * 1.5, 0);
        group.add(pin);
    }

    // Key Hole Indication (Rectangle)
    const keyholeGeo = new THREE.BoxGeometry(0.2, 1, 2.1);
    const keyhole = new THREE.Mesh(keyholeGeo, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    group.add(keyhole);

    scene.add(group);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd700, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x00aaff, 0.5);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // ANIMATION LOOP
    const animate = function () {
        requestAnimationFrame(animate);

        // Constant subtle rotation
        group.rotation.y += 0.005;
        group.rotation.x += 0.002;

        // Mouse interaction rotation
        group.rotation.y += mouseX * 0.02;
        group.rotation.x += mouseY * 0.02;

        renderer.render(scene, camera);
    };

    animate();

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
