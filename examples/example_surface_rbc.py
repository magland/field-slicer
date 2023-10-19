import kachery_cloud as kcl
import volumeview as vv

def main():
    vtk_uri = 'ipfs://bafkreiezdffcektdjjw6uh6kyxdrtzonwhbvns5btozta5smknml4oala4?label=rbc_001.vtk'
    vtk_path = kcl.load_file(vtk_uri)

    vertices, faces = vv._parse_vtk_unstructured_grid(vtk_path)

    # vertices is n x 3 array of vertex locations
    # faces is m x 3 array of vertex indices for triangular mesh

    W = vv.Workspace()
    S = W.add_surface(name='red-blood-cell', vertices=vertices, faces=faces)
    W.add_surface_scalar_field(name='scalarX', surface=S, data=vertices[:, 0])
    W.add_surface_scalar_field(name='scalarY', surface=S, data=vertices[:, 1])
    W.add_surface_scalar_field(name='scalarZ', surface=S, data=vertices[:, 2])

    F = W.create_figure()
    url = F.url(label='red blood cell')
    print(url)
    # 5/6/2022
    # https://figurl.org/f?v=gs://figurl/volumeview-4&d=ipfs://bafkreiflucxhbflk7s4v5l7coxj7prixec5a5z65gia4atpvuh2wtx6fxa&label=red%20blood%20cell

if __name__ == '__main__':
    main()