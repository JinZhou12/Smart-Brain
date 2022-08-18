import React, { useCallback} from 'react';
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";

const particlesOptions = {
    fpsLimit: 120,
    particles: {
      color: {value: "#ffffff",},  
      links: {
        color: "#ffffff",
        distance: 160,
        enable: true,
        opacity: 0.5,
        width: 1,
      },  
    collisions: {
      enable: true,
    },  
    move: {
      directions: "none",
      enable: true,
      outModes: {default: "bounce",},
      random: false,
      speed: 2,
      straight: false,
      },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 120,
    },
    opacity: {value: 0.8,},
    shape: {type: "circle",},
    size: {value: { min: 1, max: 1 },},},
    detectRetina: true,
  }

const ParticleEffect = () => {

    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);
          
    const particlesLoaded = useCallback(async (container) => {
        await {};
    }, []);

    return (
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesOptions}
          className="particles"
        />
    );
}

export default ParticleEffect;