from volumeview import _create_surface_view_from_vtk_unstructured_grid

def main():
    uri = 'sha1://e54d59b5f12d226fdfe8a0de7d66a3efd1b83d69/rbc_001.vtk'
    F = _create_surface_view_from_vtk_unstructured_grid(uri)
    url = F.url(label='red blood cell')
    print(url)

if __name__ == '__main__':
    main()