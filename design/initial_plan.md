Build a browser form which collects Email, Country, Postal Code, Password and Password Confirmation fields. It should use live inline validation to inform the user whether a field is properly filled in or not. That means validating as you type, not only upon form submission. When a field is invalid, it should be highlighted in red and show an error message to guide the user.

The form doesn’t need to actually submit anywhere, but you should give a custom error message if the user tries to submit the form with any active errors or unfilled required fields. For the sake of this lesson, make sure the <form> element has the novalidate attribute which will allow you to do all of your validation in your JavaScript files. You can still use different <input> types, but you will need to use JavaScript to check and report their validity. If all is well and the form is “submitted”, give the user a high five.

Set up a blank HTML document.
Think about how you would set up the different form elements and their accompanying validators. What objects and functions will you need? A few minutes of thought can save you from wasting an hour of coding. The best thing you can do is whiteboard the entire solution before even touching the computer.
Write the form elements.
Add the JavaScript code that checks validation as the user progresses through the form. When a user leaves a form field, it should automatically validate that field.
Test out all possible cases.
Don’t forget to style validations with CSS by using the :user-valid and :user-invalid pseudo-classes!