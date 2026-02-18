"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useAnimations } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { saira } from "@/data/fonts";
import Footer from "@/components/Footer";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";



// This is a the model component for loading your GLB

type AnimationActions = Record<string, THREE.AnimationAction | null>;

type ModelProps = { 
  url: string; 
  onAnimationsLoaded: (count: number, actions: AnimationActions, names: string[]) => void;
  modelRef: React.RefObject<THREE.Group | null>;
}

function Model({ 
  url, 
  onAnimationsLoaded, 
  modelRef 
}: ModelProps) {
  const gltf = useGLTF(url);
  const { actions, names } = useAnimations(gltf.animations, modelRef);
  const textUseAnimations = useAnimations(gltf.animations, modelRef);
  console.log("Test Use Animations:", textUseAnimations);
  console.log("GLTF Data:", gltf);

  useEffect(() => {
    // Notify parent component with animations data
    if (names.length > 0) {
      console.log("Animations found:", names);
      onAnimationsLoaded(names.length, actions, names);
    }
  }, [names, actions, onAnimationsLoaded]);

  // This autoscales and places model in the middle of the scene and fixes the material rendering issues
  gltf.scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      // Fix material rendering issues
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        console.log(materials);
        materials.forEach((mat) => {
          // Make double-sided
          mat.side = THREE.DoubleSide;
          
          // Fix transparency settings
          if (mat.transparent) {
            mat.alphaTest = 0.5; // Pixels below this alpha value won't render
          }
          
          // Ensure proper depth testing
          mat.depthWrite = true;
          mat.depthTest = true;
          
          // Force material update
          mat.needsUpdate = true;
        });
      }
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} position={[0, -1, 0]} />
    </group>
  );
}


// Optional: prefetch
useGLTF.preload("/models/animated/interGalactron.glb");

export default function AnimationViewer() {
  const [animationCount, setAnimationCount] = useState(0);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationActions, setAnimationActions] = useState<AnimationActions | null>(null);
  const [animationNames, setAnimationNames] = useState< string[]>([]);
  const modelRef = useRef<THREE.Group>(null);

  const handleAnimationsLoaded = (count: number, actions: AnimationActions, names: string[]) => {
    console.log("Setting animations:", count, names);
    setAnimationCount(count);
    setAnimationActions(actions);
    setAnimationNames(names);
  };

  const playAnimation = (index: number) => {
    if (!animationActions || !animationNames || animationNames.length === 0) {
      console.log("No animations available");
      return;
    }

    console.log("Playing animation:", animationNames[index]);

    // Stop all animations
    Object.values(animationActions).forEach((action: THREE.AnimationAction | null) => {
      action?.stop();
    });

    // Play the selected animation
    const animationName = animationNames[index];
    const action = animationActions[animationName];
    
    if (action) {
      action.reset();
      action.play();
      setIsPlaying(true);
      console.log("Animation playing:", animationName);
    } else {
      console.log("Action not found for:", animationName);
    }
  };

  const togglePlayPause = () => {
    if (!animationActions || !animationNames || animationNames.length === 0) return;

    const animationName = animationNames[currentAnimationIndex];
    const action = animationActions[animationName];

    if (action) {
      if (isPlaying) {
        action.paused = true;
        setIsPlaying(false);
        console.log("Animation paused");
      } else {
        action.paused = false;
        if (!action.isRunning()) {
          action.reset();
          action.play();
        }
        setIsPlaying(true);
        console.log("Animation resumed/started");
      }
    }
  };

  const nextAnimation = () => {
    if (animationCount === 0) return;
    const newIndex = (currentAnimationIndex + 1) % animationCount;
    setCurrentAnimationIndex(newIndex);
    playAnimation(newIndex);
  };

  const previousAnimation = () => {
    if (animationCount === 0) return;
    const newIndex = (currentAnimationIndex - 1 + animationCount) % animationCount;
    setCurrentAnimationIndex(newIndex);
    playAnimation(newIndex);
  };

  // const getCurrentAnimationName = () => {
  //   if (!animationNames || animationNames.length === 0) return "No animations available";
  //   return animationNames[currentAnimationIndex];
  // };

  return (
    <div style={{ width: "100%", height: "95vh" }}>
      <Card className="text-center flex flex-col items-center justify-center">
        <CardTitle>Interactive 3D Model Below</CardTitle>
        <CardContent className={saira.className}>Left click to drag to rotate the model</CardContent>
        <CardContent className={saira.className}>Left click and Shift to drag model around</CardContent>
        <CardContent className={saira.className}>
          <Image
            src={"/model3d2.png"}
            width={300}
            height={300}
            alt=""
          />
        </CardContent>
      </Card>

      {/* Animation Controls */}
      {animationCount > 0 && (

        <div>

        

          <div className="flex flex-col items-center">

            <Card className="flex flex-col items-center w-[60vw] p-8 mt-7 bg-blue-400">
                <CardTitle>Available Animations</CardTitle>

                <CardContent>{animationNames.map((animation) => (
                  <ol key={animation}>
                    <li className="ml-2 list-disc">{animation}</li>
                  </ol>
                ))}</CardContent>
            </Card>

          </div>


          <Card className="flex  mx-auto my-4 w-fit">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              <div className={`${saira.className} text-sm font-medium`}>
                Animation:  ({currentAnimationIndex + 1}/{animationCount})
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  onClick={previousAnimation}
                  variant="outline"
                  size="icon"
                  disabled={animationCount === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={togglePlayPause}
                  variant="default"
                  size="icon"
                  disabled={animationCount === 0}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={nextAnimation}
                  variant="outline"
                  size="icon"
                  disabled={animationCount === 0}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Canvas
        shadows
        camera={{ position: [0, 5, 9], fov: 20 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#5B21B6"), 1);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />

        <Suspense fallback={null}>
          <Model 
            url="/models/animated/interGalactron.glb" 
            onAnimationsLoaded={handleAnimationsLoaded}
            modelRef={modelRef}
          />
          <Environment preset="park" />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.8}
          makeDefault
        />
      </Canvas>
      <Footer />
    </div>
  );
}