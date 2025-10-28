# Ticket Management App - Twig Version

This is the Twig.js implementation of the Ticket Management App.

## Frameworks and Libraries Used

- Twig.js: Client-side templating engine
- Vanilla JavaScript: For state management and routing
- CSS: Shared styles from the parent directory

## Setup and Execution

1. Open `index.html` in a web browser
2. No build process required - runs directly in the browser

## Features

- Landing page with hero section and wavy background
- Authentication (simulated with localStorage)
- Dashboard with ticket statistics
- Full CRUD operations for tickets
- Responsive design
- Form validation and error handling

## Components and State Structure

- **Templates**: Stored in `templates/` directory
  - `landing.twig`: Hero section with CTA buttons
  - `auth.twig`: Login/signup forms
  - `dashboard.twig`: Statistics display
  - `tickets.twig`: CRUD interface

- **State Management**: Vanilla JavaScript with localStorage
  - Authentication state: `ticketapp_session` in localStorage
  - Tickets: Stored as JSON in localStorage

## Accessibility and Known Issues

- Basic semantic HTML structure
- Form validation with error messages
- Keyboard navigation support
- Color contrast considerations

## Test User Credentials

- Any email/password combination works for demo purposes

## Notes

- Authentication is simulated using localStorage
- Data persists across browser sessions
- No backend API - all operations are client-side
# Ticket-Twig
