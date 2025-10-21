// public/js/main.js

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    console.log("Aesthetic JS Loaded!");

    // --- 1. Anime.js: Micro-interactions ---
// --- 5. Syncfusion Initialization ---
    // We moved this code from footer.ejs to fix the 'ej' error
    if (typeof ej !== 'undefined') {
        ej.base.L10n.load({
            'en-US': {
                'grid': {
                    'EmptyRecord': 'No records to display'
                }
            }
        });
    }
    // Animate all buttons on hover
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            anime({
                targets: btn,
                scale: [1, 1.05],
                translateY: [0, -2],
                duration: 300,
                easing: 'easeOutExpo'
            });
        });
        btn.addEventListener('mouseleave', () => {
            anime({
                targets: btn,
                scale: [1.05, 1],
                translateY: [-2, 0],
                duration: 400,
                easing: 'easeOutElastic(1, .6)'
            });
        });
    });

    // Animate page titles on load
    anime({
        targets: '.page-title',
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 1200,
        delay: 200,
        easing: 'easeOutExpo'
    });


    // --- 2. ScrollReveal: Fade-in on scroll ---
    // Check if ScrollReveal is loaded
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.product-card', {
            delay: 100,
            distance: '50px',
            origin: 'bottom',
            opacity: 0,
            interval: 100, // Stagger effect
            easing: 'ease-in-out',
            reset: false // Animation only happens once
        });

        ScrollReveal().reveal('.hero-section', {
            delay: 200,
            duration: 1000,
            distance: '30px',
            origin: 'top',
            opacity: 0
        });
    }

    // --- 3. Popmotion: Draggable product image ---
    // Check if Popmotion is loaded
    const productImage = document.querySelector('.product-detail-image');
    if (typeof popmotion !== 'undefined' && productImage) {
        const { pointer, physics } = popmotion;

        const ball = { x: 0, y: 0 };
        const physicsBall = physics({
            ...ball,
            friction: 0.1,
            springStrength: 200,
            to: { ...ball },
        }).start(v => {
            // Apply the transform to the image
            productImage.style.transform = `translate(${v.x}px, ${v.y}px)`;
        });

        // Make the image draggable
        pointer(productImage).start(e => {
            e.preventDefault();
            physicsBall.set(e.point);
        });

        // Snap back to center on mouse up
        document.addEventListener("mouseup", () => physicsBall.spring({ x: 0, y: 0 }));
    }


    // --- 4. Three.js: 3D Model Viewer ---
    const modelContainer = document.getElementById('three-js-container');
    if (typeof THREE !== 'undefined' && modelContainer) {
        
        // --- Basic Setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent bg
        
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        modelContainer.appendChild(renderer.domElement);

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        camera.position.z = 3;

        // --- Model Loading ---
        // Get the model path from the data attribute (set in EJS)
        const modelPath = modelContainer.dataset.modelPath;

        if (modelPath && typeof THREE.GLTFLoader !== 'undefined') {
            // We have a real model path! Let's try to load it.
            const loader = new THREE.GLTFLoader();
            loader.load(modelPath, (gltf) => {
                const model = gltf.scene;
                // Center the model and scale it
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center); // Center it
                scene.add(model);
            }, undefined, (error) => {
                console.error('Error loading 3D model:', error);
                addPlaceholderCube(); // Fallback if loading fails
            });
        } else {
            // --- Placeholder Cube (if no model path) ---
            addPlaceholderCube();
        }

        function addPlaceholderCube() {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x007bff,
                wireframe: true 
            });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            // Add auto-rotation to the cube
            function animateCube() {
                requestAnimationFrame(animateCube);
                cube.rotation.x += 0.005;
                cube.rotation.y += 0.005;
                renderer.render(scene, camera);
            }
            animateCube();
        }

        // --- Render Loop (if not using placeholder) ---
        if (modelPath) {
            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();
        }
        
        // --- Handle Resize ---
        window.addEventListener('resize', () => {
            camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
        });
    }

    // --- 5. Syncfusion (Example) ---
    // We didn't create an "orders history" page, but if we did
    // and had an element <div id="orderGrid"></div>, this is how it would work.
    /*
    const orderGridElement = document.getElementById('orderGrid');
    if (orderGridElement && typeof ej !== 'undefined') {
        // This 'ordersData' would need to be passed from EJS
        // e.g., <script> const ordersData = <%- JSON.stringify(orders) %> </script>
        const ordersData = [
            { OrderID: 10248, CustomerName: 'Paul Henriot', Total: 81.50, Status: 'Shipped' },
            { OrderID: 10249, CustomerName: 'Karin Josephs', Total: 120.00, Status: 'Processing' }
        ];

        const grid = new ej.grids.Grid({
            dataSource: ordersData,
            columns: [
                { field: 'OrderID', headerText: 'Order ID', width: 120 },
                { field: 'CustomerName', headerText: 'Customer Name' },
                { field: 'Total', headerText: 'Total', format: 'C2' },
                { field: 'Status', headerText: 'Status' }
            ],
            allowPaging: true
        });
        grid.appendTo(orderGridElement);
    }
    */
});