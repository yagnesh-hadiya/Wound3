import React, { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { PLYLoader } from "three-stdlib";
import {
  Html,
  OrbitControls,
  PerspectiveCamera,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { Progress } from "reactstrap";
import { WoundHistoryListType } from "../../../../../types/ManagePatientType";

interface PlyModelProps {
  blobUrl: string | null;
  onBoundingBoxChange: (boundingBox: THREE.Box3) => void;
}

const PlyModel: React.FC<PlyModelProps> = ({
  blobUrl,
  onBoundingBoxChange,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Always call useLoader and useRef
  const geometry = useLoader(PLYLoader, blobUrl || "") as THREE.BufferGeometry;

  useEffect(() => {
    if (blobUrl && meshRef.current) {
      meshRef.current.geometry.computeBoundingBox();
      const boundingBox = meshRef.current.geometry.boundingBox;
      if (boundingBox) {
        meshRef.current.position.set(
          -(boundingBox.max.x + boundingBox.min.x) / 2,
          -(boundingBox.max.y + boundingBox.min.y) / 2,
          -(boundingBox.max.z + boundingBox.min.z) / 2
        );
        onBoundingBoxChange(boundingBox);
      }

      if (meshRef.current.geometry.attributes.color) {
        meshRef.current.material = new THREE.MeshStandardMaterial({
          vertexColors: true,
        });
      } else {
        meshRef.current.material = new THREE.MeshMatcapMaterial({
          flatShading: true,
          color: "#ECECEC",
        });
      }
    }
  }, [blobUrl, geometry, onBoundingBoxChange]);

  return <mesh ref={meshRef} geometry={geometry} />;
};

interface SelectedWoundProps {
  selectedWound?: WoundHistoryListType | null;
}

const CameraSetup: React.FC<{
  zoom: number;
  boundingBox: THREE.Box3 | null;
}> = ({ zoom, boundingBox }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (boundingBox) {
      const size = boundingBox.getSize(new THREE.Vector3()).length();
      const newCameraDistance = size * 2.5; // Adjust this multiplier as needed
      camera.position.z = newCameraDistance;
      camera.zoom = zoom; // Apply the zoom level
      camera.updateProjectionMatrix();
    }
  }, [boundingBox, zoom, camera]);

  return null;
};

const PLYViewer: React.FC<SelectedWoundProps> = ({ selectedWound }) => {
  const [zoom, setZoom] = useState(1); // Set default zoom level
  const [isDragging, setIsDragging] = useState(false);
  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);

  function Loader() {
    const { progress } = useProgress();
    return (
      <Html center>
        <span>{progress.toFixed(2) + "%"} </span>
        <br />
        loaded
      </Html>
    );
  }

  useEffect(() => {
    // Reset bounding box and zoom when `selectedWound` changes
    setBoundingBox(null);
    setZoom(1);
  }, [selectedWound]);

  const handleSliderChange = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isDragging) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newZoom = (offsetX / rect.width) * 1.5 + 0.5; // Scaling to zoom range [0.5, 2]
      setZoom(Math.max(0.5, Math.min(2, newZoom))); // Ensure zoom stays within [0.5, 2]
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Canvas>
        <Suspense fallback={<Loader />}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <PerspectiveCamera makeDefault />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <PlyModel
            blobUrl={selectedWound?.plyLink ?? null}
            onBoundingBoxChange={setBoundingBox}
          />
          <OrbitControls />
          <CameraSetup zoom={zoom} boundingBox={boundingBox} />
        </Suspense>
      </Canvas>
      <div
        className="progress-wr"
        onMouseMove={handleSliderChange}
        onMouseLeave={handleDragEnd}
        onMouseDown={handleDragStart}
      >
        <Progress
          value={((zoom - 0.5) * 100) / 1.5} // Calculate percentage for progress bar
          color="white"
          style={{
            height: "8px",
            cursor: isDragging ? "grabbing" : "pointer",
            position: "relative",
          }}
        />
        <div
          className="slider-thumb"
          style={{
            left: `calc(${((zoom - 0.5) * 100) / 1.5}% - 8px)`, // Position the thumb
          }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
        />
      </div>
    </>
  );
};

export default PLYViewer;
