# On 12/10/21 produced output:
# https://figurl.org/f?v=gs://figurl/volumeview-2&d=8cf32c552f9cb99aa3794b5c4976176b179c0009&channel=flatiron1&label=red%20blood%20cell

import kachery_client as kc
import volumeview as vv

def main():
    # your node needs to be a member of the flatiron1 kachery channel to obtain this file
    vtk_uri = 'sha1://e54d59b5f12d226fdfe8a0de7d66a3efd1b83d69/rbc_001.vtk'
    vtk_path = kc.load_file(vtk_uri)

    vertices, faces = vv._parse_vtk_unstructured_grid(vtk_path)

    # vertices is n x 3 array of vertex locations
    # faces is m x 3 array of vertex indices for triangular mesh

    F = vv.create_surface_view(vertices=vertices, faces=faces)
    url = F.url(label='red blood cell')
    print(url)

if __name__ == '__main__':
    main()