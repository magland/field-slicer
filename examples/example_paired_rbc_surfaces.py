import kachery_client as kc
import volumeview as vv
import numpy as np

def main():
    # your node needs to be a member of the flatiron1 kachery channel to obtain this file
    vtk_uri = 'sha1://e54d59b5f12d226fdfe8a0de7d66a3efd1b83d69/rbc_001.vtk'
    vtk_path = kc.load_file(vtk_uri)

    vertices, faces = vv._parse_vtk_unstructured_grid(vtk_path)
    vertices2 = np.array([[-v[0] + 10, -v[1] + 2, v[2]] for v in vertices], np.float32)

    # vertices is n x 3 array of vertex locations
    # faces is m x 3 array of vertex indices for triangular mesh

    W = vv.Workspace()
    S = W.add_surface(name='red-blood-cell', vertices=vertices, faces=faces)
    W.add_surface_scalar_field(name='scalarX', surface=S, data=vertices[:, 0])
    W.add_surface_scalar_field(name='scalarY', surface=S, data=vertices[:, 1])
    W.add_surface_scalar_field(name='scalarZ', surface=S, data=vertices[:, 2])

    mirrored_surface = W.add_surface(name="mirrored-rbc", vertices=vertices2, faces=faces)
    W.add_surface_scalar_field(name='scalarX', surface=mirrored_surface, data=vertices[:, 0])
    W.add_surface_scalar_field(name='scalarY', surface=mirrored_surface, data=vertices[:, 1])
    W.add_surface_scalar_field(name='scalarZ', surface=mirrored_surface, data=vertices[:, 2])

    F = W.create_figure()
    url = F.url(label='red blood cell')
    print(url)
    # 1/6/2022
    # https://www.figurl.org/f?v=gs://figurl/volumeview-2&d=a997d5dd425a92ee67aa750aa48a9d9c3193f474&channel=flatiron1&label=red%20blood%20cell

if __name__ == '__main__':
    main()