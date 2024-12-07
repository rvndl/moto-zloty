use std::{fs, path::Path};

use image::ImageReader;

use crate::image_processor::webp::encode_webp;

pub fn convert_image(input_path: &str, resize: bool) -> Result<String, String> {
    let input_path = Path::new(input_path);

    let image_render =
        ImageReader::open(input_path).map_err(|e| format!("failed to open image: {}", e))?;

    let image = image_render
        .decode()
        .map_err(|e| format!("failed to decode image: {}\n", e))?;

    let webp_data = encode_webp(&image, resize)?;

    let output_path = if resize {
        input_path.with_extension("small.webp")
    } else {
        input_path.with_extension("webp")
    };

    fs::write(output_path.clone(), webp_data.to_vec())
        .map_err(|e| format!("failed to write WebP file: {}", e))?;

    Ok(output_path.display().to_string())
}
