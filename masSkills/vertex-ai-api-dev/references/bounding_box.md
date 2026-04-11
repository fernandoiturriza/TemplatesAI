# Bounding Box Detection (Vertex AI)

Detect and localize objects within images or videos using bounding boxes. The model returns coordinates in the format `[y_min, x_min, y_max, x_max]`, normalized from 0 to 1000.

## Coordinate System
- **Format**: `[y_min, x_min, y_max, x_max]`
- **Normalization**: Coordinates are integers from `0` to `1000`.
- **Origin**: `[0, 0]` is the top-left corner of the image.

## Visualization Helper (Logic)
To visualize the results, scale the normalized coordinates back to the original image dimensions:
`actual_coord = (normalized_coord / 1000) * actual_dimension`
