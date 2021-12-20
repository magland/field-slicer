import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { DoubleSide } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type Props = {
    vertices: number[][]
    faces: number[][]
    width: number
    height: number
}



const headlights = (cameraPosition: THREE.Vector3) => {
    // return [new THREE.PointLight(0xff0000), new THREE.PointLight(0x0000ff)]
    return [new THREE.PointLight(0xffffff, .5), new THREE.PointLight(0xffffff, .5), new THREE.AmbientLight(0xffffff, 0.2)]
}
const headlight = () => {
    return [new THREE.PointLight(0xffffff, .5), new THREE.AmbientLight(0xffffff, 0.2)]
}
const addThreePointLights = (camera: THREE.PerspectiveCamera, test: boolean = false) => {
    // A traditional three-light setup has the main shadow-generating light, or key light,
    // slightly above the camera and at an angle ~30-45 degrees to the subject;
    // the fill light comes from the other side and is softer and is trying to ensure shadows aren't
    // too dramatic;
    // then a rim light opposite the camera provides additional highlights to the object edges.
    // The key light should be the brightest light source.
    // Adding these to the camera ensures they'll always be relative to the camera position and
    // use its coordinate system.
    const colors = test ? [0xff0000, 0x0000ff, 0x00ff00] : [0xffffff, 0xffffff, 0xffffff]
    const keyLight = new THREE.SpotLight(colors[0], .60)
    const fillLight = new THREE.DirectionalLight(colors[1], .4)
    const rimLight = new THREE.DirectionalLight(colors[2], .3)
    ;[keyLight, fillLight, rimLight].forEach(l => camera.add(l))
    keyLight.position.set(7, 2, 0)
    fillLight.position.set(-7, 2, 0)
    rimLight.position.set(0, 1, -2)
    rimLight.target = camera
}

const SurfaceWidget: FunctionComponent<Props> = ({width, height, vertices, faces}) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null)
    const scene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color( 0x000000 );
        return scene
    }, [])
    const bbox = useMemo(() => {
        const xmin = min(vertices.map(v => (v[0])))
        const xmax = max(vertices.map(v => (v[0])))
        const ymin = min(vertices.map(v => (v[1])))
        const ymax = max(vertices.map(v => (v[1])))
        const zmin = min(vertices.map(v => (v[2])))
        const zmax = max(vertices.map(v => (v[2])))

        return new THREE.Box3(new THREE.Vector3(xmin, ymin, zmin), new THREE.Vector3(xmax, ymax, zmax))
    }, [vertices])
    const {camera, controls} = useMemo(() => {
        if (!container) return {camera: undefined, controls: undefined}
        const p = {x: (bbox.min.x + bbox.max.x) / 2, y: (bbox.min.y + bbox.max.y) / 2, z: (bbox.min.z + bbox.max.z) / 2}
        const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 100000 )
        camera.position.set(p.x, p.y, p.z + (bbox.max.z - bbox.min.z) * 3)
        const controls = new OrbitControls( camera, container )
        controls.target.set(p.x, p.y, p.z)
        return {
            camera,
            controls
        }
    }, [width, height, bbox, container])
    const renderer = useMemo(() => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );
        return renderer
    }, [width, height])
    const objects = useMemo(() => {
        // const material = new THREE.MeshNormalMaterial( {
        //     flatShading: true,
        //     side: DoubleSide
        // })
        const material = new THREE.MeshPhongMaterial( {
            color: 'red',//'white', // was green
            flatShading: true,
            side: DoubleSide
        })
        // const material = new THREE.MeshBasicMaterial( {
        //     color: 'white',
        //     wireframe: true
        // })
    
        const geometry = new THREE.BufferGeometry()
    
        const indices0: number[] = [] // faces
        const vertices0 = []
    
        for (let v of vertices) {
            vertices0.push(v[0], v[1], v[2])
        }
        for (let f of faces) {
            indices0.push(f[0], f[1], f[2])
        }
        
        geometry.setIndex( indices0 );
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices0, 3 ) )
        geometry.computeVertexNormals()
        const obj = new THREE.Mesh( geometry, material )
        return [obj]
    }, [vertices, faces])
    const redBlueLights = useMemo(() => {
        const p = {x: (bbox.min.x + bbox.max.x)/2, y: (bbox.min.y + bbox.max.y)/2, z: (bbox.min.z + bbox.max.z)/2}
        const redlight = new THREE.PointLight(0xAA0000)
        redlight.position.set(p.x, p.y + (bbox.max.y - bbox.min.y) * 3, p.z)
        const bluelight = new THREE.PointLight(0x0000AA)
        bluelight.position.set(p.x + (bbox.max.x - bbox.min.x) * 3, p.y, p.z)
        const ambientLight = new THREE.AmbientLight()
        ambientLight.intensity = 0.2
        return [redlight, bluelight, ambientLight]
    }, [bbox])
    // const flatHemiLight = useMemo(() => {
    //     const light = new THREE.HemisphereLight()
    //     return [light]
    // }, [])
    // const smoothDramaticLights = useMemo(() => {
    //     const p = {x: (bbox.min.x + bbox.max.x)/2, y: (bbox.min.y + bbox.max.y)/2, z: (bbox.min.z + bbox.max.z)/2}
    //     const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3)
    //     light.position.set(p.x, p.y, p.z + (bbox.max.z - bbox.min.z) * 4)
    //     return [light]
    // }, [bbox])
    useEffect(() => {
        if (!scene) return
        if (!container) return
        if (!controls) return
        if (!camera) return

        scene.clear()

        while (container.firstChild) container.removeChild(container.firstChild)
        container.appendChild(renderer.domElement)
        
        objects.forEach((object) => scene.add(object))

        // const lights = headlight()
        // lights.forEach(l => camera.add(l))
        addThreePointLights(camera)
        scene.add(camera)

        const render = () => {
            renderer.render( scene, camera );
        }
        controls.addEventListener( 'change', render );
        controls.update()
        render()

        return () => {
            controls.removeEventListener('change', render)
        }
    }, [renderer, bbox, camera, camera?.position, container, controls, scene, objects, redBlueLights])
    return (
        <div ref={setContainer} />
    )
}

const min = (a: number[]) => {
    return a.reduce((prev, current) => (prev < current) ? prev : current, a[0] || 0)
}

const max = (a: number[]) => {
    return a.reduce((prev, current) => (prev > current) ? prev : current, a[0] || 0)
}

export default SurfaceWidget