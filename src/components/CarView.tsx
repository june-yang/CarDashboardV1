import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CarView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gear, setGear] = useState<'P' | 'R' | 'N' | 'D'>('D');

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera - Using Orthographic for parallel lane lines
    const aspect = width / height;
    const frustumSize = 15;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(0, 15, 5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 10, 7.5);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x007aff, 5, 20);
    blueLight.position.set(0, 2, 0);
    scene.add(blueLight);

    // Car Model - Using the provided top-down car image
    const carGroup = new THREE.Group();
    
    const textureLoader = new THREE.TextureLoader();
    // Use the uploaded car.png file
    const carTexture = textureLoader.load('/car.png'); 
    
    const carPlaneGeom = new THREE.PlaneGeometry(4.62, 6.4); // Width increased by 10% (4.2 * 1.1 = 4.62)
    const carPlaneMat = new THREE.MeshBasicMaterial({ 
      map: carTexture, 
      transparent: true,
      side: THREE.DoubleSide
    });
    const carPlane = new THREE.Mesh(carPlaneGeom, carPlaneMat);
    carPlane.rotation.x = -Math.PI / 2; // Lay flat on the road
    carPlane.position.set(0.075, -0.55, 0); // Shifted right by another 0.2% (total 0.075 units)
    carGroup.add(carPlane);

    scene.add(carGroup);

    // Road Setup
    const roadWidth = 12; // Wider road for 3 lanes
    const roadLength = 100;
    
    // Center Path Line (Royal Blue Glow Strip)
    const centerLineLength = 50;
    const centerLineGeom = new THREE.PlaneGeometry(2.88, centerLineLength); // Reduced width by 20% (3.6 * 0.8 = 2.88)
    const centerLineMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        royalBlue: { value: new THREE.Color(0x4169E1) },
        lightBlue: { value: new THREE.Color(0xadd8e6) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 royalBlue;
        uniform vec3 lightBlue;

        void main() {
          // Horizontal glow effect (X-axis)
          float distX = abs(vUv.x - 0.5) * 2.0;
          float glowX = exp(-distX * 3.5); // Soft blur falloff
          
          // Vertical fade at the top (vUv.y = 1 is the far end)
          // "From nothing to something" short distance fade
          float topFade = 1.0 - smoothstep(0.99, 1.0, vUv.y);
          
          // Subtle fade at the bottom (vUv.y = 0 is near the car) 
          // to make the transition to the car image smoother
          float bottomFade = smoothstep(0.0, 0.01, vUv.y);
          
          // Mix colors for a slight vertical depth
          vec3 finalColor = mix(lightBlue, royalBlue, topFade);
          
          // Final alpha
          float alpha = glowX * topFade * bottomFade * 0.8;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    });
    const centerLine = new THREE.Mesh(centerLineGeom, centerLineMat);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.y = -0.58;
    // Position it so it ends at the car (z=0) and extends forward (negative z)
    centerLine.position.z = -centerLineLength / 2; 
    scene.add(centerLine);

    // Headlight Beam (Triangular glow in front of car)
    const beamGeom = new THREE.PlaneGeometry(6, 8);
    const beamMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        color: { value: new THREE.Color(0xffffff) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 color;
        void main() {
          // Create a triangular mask
          float mask = (1.0 - vUv.y) * (1.0 - abs(vUv.x - 0.5) * 2.5);
          mask = clamp(mask, 0.0, 1.0);
          gl_FragColor = vec4(color, mask * 0.15);
        }
      `
    });
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.rotation.x = -Math.PI / 2;
    beam.position.set(0, -0.57, 4); // Positioned in front of the car
    scene.add(beam);

    // Three Lanes (4 lines: 2 boundaries, 2 dividers)
    const sideLinesGeom = new THREE.PlaneGeometry(roadWidth, roadLength);
    const sideLinesMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x999999) } // Light grey base
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        
        float getLine(float center, float x) {
          float dist = abs(x - center);
          return exp(-dist * 180.0); 
        }

        void main() {
          // Reduced distance between lines by 20% (moved closer to center 0.5)
          float line1 = getLine(0.11, vUv.x);
          float line2 = getLine(0.37, vUv.x);
          float line3 = getLine(0.63, vUv.x);
          float line4 = getLine(0.89, vUv.x);
          
          // Base line mask (where the 4 lines are)
          float mask = clamp(line1 + line2 + line3 + line4, 0.0, 1.0);
          
          // Animation: moving pulse
          float grad = fract(vUv.y * 1.5 + time * 1.2);
          
          // Pulse shape: Symmetric fade (Transparent -> Silver White -> Transparent)
          // Higher power (40.0) makes the pulse short
          float pulse = pow(sin(grad * 3.1415926), 40.0); 
          
          // Vertical fade at both ends (top and bottom)
          // vUv.y = 0 is near, vUv.y = 1 is far
          float verticalFade = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.8, 1.0, vUv.y));
          
          // Colors
          vec3 baseLineColor = vec3(0.9); // Constant grey line color (3x brighter)
          vec3 silverWhite = vec3(0.9, 0.9, 1.0); // Bright pulse color
          
          // Mix colors: base grey boosted by silver white pulse
          vec3 finalColor = mix(baseLineColor, silverWhite, pulse);
          
          // Alpha: base visibility (0.4) + pulse boost (0.4), then apply vertical fade
          float finalAlpha = mask * (0.4 + pulse * 0.4) * verticalFade;
          
          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
      transparent: true
    });
    const sideLines = new THREE.Mesh(sideLinesGeom, sideLinesMat);
    sideLines.rotation.x = -Math.PI / 2;
    sideLines.position.y = -0.6;
    scene.add(sideLines);

    // Animation loop
    let lastTime = 0;
    const animate = (now: number) => {
      requestAnimationFrame(animate);
      const delta = now - lastTime;
      if (delta < 33) return; // ~30fps
      lastTime = now;

      sideLinesMat.uniforms.time.value += 0.02;
      renderer.render(scene, camera);
    };
    animate(0);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      
      const newAspect = w / h;
      camera.left = (frustumSize * newAspect) / -2;
      camera.right = (frustumSize * newAspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <div ref={containerRef} className="w-full h-full" />

      {/* Edge Fades & Blur Overlays */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none backdrop-blur-[1px] z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none backdrop-blur-[1px] z-10" />
      
      {/* Gear Status */}
      <div className="absolute bottom-32 flex gap-8 text-2xl font-bold tracking-widest text-white/30 z-20">
        {(['P', 'R', 'N', 'D'] as const).map((g) => (
          <span
            key={g}
            onClick={() => setGear(g)}
            className={`cursor-pointer transition-all duration-300 ${
              gear === g ? 'text-white scale-125' : 'hover:text-white/60'
            }`}
          >
            {g}
          </span>
        ))}
      </div>

      {/* Settings Items Row */}
      <div className="absolute bottom-4 flex gap-4 px-6 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 z-20">
        <SettingIcon icon={<Lock size={18} />} label="Lock" />
        <SettingIcon icon={<Package size={18} />} label="Frunk" />
        <SettingIcon icon={<Archive size={18} />} label="Trunk" />
        <SettingIcon icon={<Zap size={18} />} label="Charge" />
      </div>
    </div>
  );
};

const SettingIcon: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white/10 group-hover:text-white transition-all">
      {icon}
    </div>
    <span className="text-[9px] font-bold text-white/20 group-hover:text-white/40 uppercase tracking-tighter">{label}</span>
  </div>
);

import { Lock, Package, Archive, Zap } from 'lucide-react';

export default CarView;
