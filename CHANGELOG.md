# Changelog

## [1.2.13] - 2024-03-19

### Enhanced
- Significantly improved URL validation and normalization
- Added support for feed:// protocol conversion
- Better handling of www prefixes and domain parts
- Improved domain validation with DNS label length checks
- Enhanced error messages for invalid URLs
- Updated all ping services to use HTTPS where available
- Improved CORS handling and security headers
- Reduced number of ping services to most reliable ones
- Added proper timeout handling for all requests

### Fixed
- URL validation edge cases
- Protocol handling issues
- Domain part validation
- TLD validation
- Port handling in URLs
- Trailing slash consistency
- Mixed content warnings
- CORS issues with ping services

## [1.2.12] - 2024-03-19
[Previous changelog entries remain the same...]