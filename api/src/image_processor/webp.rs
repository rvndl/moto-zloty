use image::{codecs::webp::WebPEncoder, DynamicImage, ExtendedColorType};

pub fn encode_webp(image: &DynamicImage, resize: bool) -> Result<Vec<u8>, String> {
    let image = if resize {
        image.resize_to_fill(
            image.width() / 4,
            image.height() / 4,
            image::imageops::FilterType::Lanczos3,
        )
    } else {
        image.clone()
    };

    let rgba_image = image.to_rgba8();
    let mut webp_data = Vec::new();

    let encoder = WebPEncoder::new_lossless(&mut webp_data);
    encoder
        .encode(
            rgba_image.as_raw(),
            rgba_image.width(),
            rgba_image.height(),
            ExtendedColorType::Rgba8,
        )
        .map_err(|e| format!("{e}"))?;

    Ok(webp_data)
}
