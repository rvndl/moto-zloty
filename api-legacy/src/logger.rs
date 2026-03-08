use std::time::SystemTime;

use fern::colors::{Color, ColoredLevelConfig};

pub fn setup() -> Result<(), fern::InitError> {
    let colors_line = ColoredLevelConfig::new()
        .error(Color::Red)
        .warn(Color::Yellow)
        .info(Color::White)
        .debug(Color::White)
        .trace(Color::BrightBlack);

    let colors_level = colors_line.info(Color::Green);

    fern::Dispatch::new()
        .format(move |out, message, record| {
            out.finish(format_args!(
                "{color_line}{color_timestamp}{date}{color_line} {color_level}{level}{color_line} {message}\x1B[0m",
                color_line = format_args!(
                    "\x1B[{}m",
                    colors_line.get_color(&record.level()).to_fg_str()
                ),
                color_timestamp = format_args!(
                    "\x1B[{}m",
                    Color::BrightBlack.to_fg_str()
                ),
                date = humantime::format_rfc3339_seconds(SystemTime::now()),
                color_level = format_args!(
                    "\x1B[{}m",
                    colors_level.get_color(&record.level()).to_fg_str()
                ),
                level = colors_level.color(record.level()),
                message = message
            ))
        })
        .level(log::LevelFilter::Info)
        .chain(std::io::stdout())
        .chain(fern::log_file("output.log")?)
        .apply()?;

    Ok(())
}
