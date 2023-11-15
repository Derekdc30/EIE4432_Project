# EIE4432_Project Concert Ticket Selling System
1. Basic feature:
- [x] User Account Registration<br />
      - User registration page: support standard information including userID, password, nickname, email, gender, birthdate, etc.<br />
      - Validation checks for input value, i.e., Password Policy and Duplicate User ID<br />
      - Feedback message on validation failure and registration success/failure<br />
      - Password stored in a database with password hashing<br />
      - An admin doesn’t need to register an account. <br />
- [x] User Login<br />
      - Two roles: admin and users<br />
      - Use user ID and password to log in. The admin uses the default ID “admin” and password “adminpass” to log in.<br />
      - User logout<br />
- [ ] Event Dashboard<br />
      - Show the list of events with event details (date/time, title, venue, description)<br />
      - At least one event<br />
      - Ticket sales for each event (Real-time ticket availability)<br />
- [ ] Ticket Booking Page<br />
      -Select seats from the SVG seat map<br />
      - View available and occupied seats in the SVG-based seat map (use different colors)<br />
      - Real-time price calculation<br />
- [ ] Payment Page<br />
      -Show event details, seat selection and total price<br />
      - Input payment details (details could be fake)<br />
      - Feedback on payment status<br />
      - Show electronic tickets to buyers after successful purchase<br />
      - Update the order status upon successful payment<br />
- [ ] Seat Management Page (Admin only)<br />
      - Create SVG-based seat maps (at least 40 seats) for all venues<br />
      - View current available and occupied seats in the SVG-based seat map (use different colors)<br />
      - All seats with the same price<br />
- [ ] Event Management Page (Admin only)<br />
      - Create new events (date/time, title, venue, description)<br />
2. Credit Features:<br />
- [ ] User Account Registration<br />
      - User registration page: support profile image on top of other standard information.<br />
- [ ] User Login<br />
      - Choice to remember login user-id<br />
      - Forget password feature<br />
      - The user will be automatically logged out after a certain period of idle time<br />
- [ ] User Account Management<br />
      - View user profile<br />
      - Update user profile, including nickname, password, email and profile image<br />
- [ ] Event Dashboard<br />
      - Show the list of events with event details (date/time, title, venue, description, plus cover image)<br />
      - At least two events<br />
      - Filter events by date/time, title, venue, description with search function<br />
      - Real-time event name suggestion while searching (like Google auto-complete predictions)<br />
- [ ] Transaction History<br />
      - Show the entire transaction history with ticket information and price<br />
- [ ] Seat Management Page (Admin only)<br />
      - Modify SVG-based seat maps for all venues<br />
      - At least two categories of price for all seats, e.g. economy price and first-class price for flight tickets.<br />
- [ ] Event Management Page (Admin only)<br />
      - Create new events (add cover image on top of date/time, title, venue, and description)<br />
      - Filter events by date/time, title, venue, description with search function<br />
      - Modify existing events (date/time, title, venue, description, cover image)<br />
      - List all users’ transaction history with ticket information and price for each event<br />
3. Advanced Features:<br />
- [ ] User Account Management<br />
      - View other user account information (Admin only)<br />
      - Track and log user account activities, such as login attempts, profile edits, and password changes (Both admin and user)<br />
- [ ] Seat Management Page (Admin only)<br />
      - Interactive SVG-based seat map (show the associated user who bought the seat when clicking/hovering the seat)<br />
- [ ] Event Management Page (Admin only)<br />
      - Support cancelling or rescheduling of events (need to notify the ticket holder via user dashboard)<br />






