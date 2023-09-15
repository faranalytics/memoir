# Changelog

## [2.0.0] - 2023-09-15
### Added
- CHANGELOG.md
- This project adheres to Semantic Versioning.
### Changed
- Abstract base classes have been renamed; the word "Base" was removed from the class name.
- `LevelLogger` methods are called using JavaScript's optional chaining operator.  Please see the README.md for an explanation.
- `LevelLogger` now takes an optional `Level` argument that effects how the `Logger`'s interface is configured.
- The `Meta` object has been renamed to `Metadata`.
- `Loggers`, `Handlers`, and `Formatters` that depend on the `Metadata` type have been refactored into separate modules.

## [1.0.0]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security