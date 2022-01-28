% Important: you must run the following prior to executing this script.
% Otherwise, MATLAB will likely crash due to Python library conflicts.
%
% pyenv("ExecutionMode", "OutOfProcess")

% 1/28/22
% https://figurl.org/f?v=gs://figurl/volumeview-2&d=efb1c7ea332890e9ec4ec4a633b7ddf490400a39&channel=flatiron1&label=matlab-test

% define vertices and faces of a cube
a = 30;
vertices = [[-a, -a, -a]; [-a, -a, a]; [-a, a, -a]; [-a, a, a]; [a, -a, -a]; [a, -a, a]; [a, a, -a]; [a, a, a]];
faces = [
    [0, 1, 3]; [0, 3, 2]; [4, 5, 7]; [4, 7, 6]; % [-a, *, *] [a, *, *]
    [0, 1, 5]; [0, 5, 4]; [2, 3, 7]; [2, 7, 6]; % [*, -a, *] [*, a, *]
    [0, 2, 6]; [0, 6, 4]; [1, 3, 7]; [1, 7, 5]  % [*, *, -a] [*, *, a]
];

% define a scalar field on the vertices of the surface
scalar1 = [0, 1, 2, 3, 4, 5, 6, 7];

% Create a VolumeView workspace and add a surface and scalar field
W = py.volumeview.Workspace();
surf = W.add_surface(pyargs( ...
    'name', 'cube', ...
    'vertices', py.numpy.array(vertices, pyargs('dtype', 'float32')), ...
    'faces', py.numpy.array(faces, pyargs('dtype', 'int32')) ...
));
W.add_surface_scalar_field(pyargs( ...
    'name', 'scalar1', ...
    'surface', surf, ...
    'data', py.numpy.array(scalar1, pyargs('dtype', 'float32')) ...
));

% Create and display the figURL
F = W.create_figure();
url = char(F.url(pyargs('label', 'matlab-test')));
disp(sprintf('<a href="%s">%s</a>', url, url))
