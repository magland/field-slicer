from typing import List
import numpy as np
import figurl as fig

def create_volume3d(v: np.ndarray, *, component_names: List[str]):
    assert v.ndim == 4, 'Array must be 4-dimensional (first dimension is channels)'
    num_channels = v.shape[0]
    nx = v.shape[1]
    ny = v.shape[2]
    nz = v.shape[3]
    assert num_channels == len(component_names)
    assert nx * ny * nz <= 1e7
    assert v.dtype in [np.float32, np.int16, np.int32], f'Unsupported data type: {v.dtype}'
    data = {
        'type': 'volume3d',
        'data': v,
        'componentNames': component_names
    }
    F = fig.Figure(view_url='gs://figurl/volumeview-1', data=data)
    return F
