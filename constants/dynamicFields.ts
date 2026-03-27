export const RegistrationFields = [
    { id: "first_name", label: "First name", type: "text", placeholder: "Enter your first name" },
    { id: "last_name", label: "Last name", type: "text", placeholder: "Enter your last name" },
    { id: "email", label: "Email", type: "text", placeholder: "Enter your email" },
    { id: "password", label: "Password", type: "password", placeholder: "Password" },
    { id: "password_confirm", label: "Confirm Password", type: "password", placeholder: "Please reenter password" },
]
export const PASSWORD_CHANGE_FORM_FIELDS = [
    {
        id: "current_password",
        label: "Current Password",
        placeholder: "Enter your current password",
        type: "password"
    },
    {
        id: "new_password",
        label: "New Password",
        placeholder: "Enter your new password",
        type: "password"
    },
    {
        id: "confirm_password",
        label: "Confirm New Password",
        placeholder: "Re-enter your new password",
        type: "password"
    }
]
export const ADDRESS_FIELDS = [
    { id: "address_for", label: "Address Type", type: "select", options: ["home", "work", "other"] },
    { id: "phone", label: "Phone", type: "text" },
    { id: "address_line_1", label: "Address Line 1", type: "text" },
    { id: "address_line_2", label: "Address Line 2", type: "text" },
    { id: "city", label: "City", type: "text" },
    { id: "state", label: "State", type: "text" },
    { id: "postal_code", label: "Postal Code", type: "text" },
    { id: "country", label: "Country", type: "text" },
    { id: "is_default", label: "Set as default address", type: "checkbox" }

]
export const PAYMENT_METHODS_FIELDS = [
    { id: 'UPI', label: 'UPI', placeholder: 'Enter your UPI ID', type: 'text', description: 'We will redirect you to your UPI app to complete the payment.' },
    { id: 'CreditCard', label: 'Credit or Debit Card', placeholder: 'Card Number', type: 'text', description: 'We accept all major credit and debit cards. Your card details are processed securely.' },
    { id: 'cod', label: 'Cash on Delivery/Pay on Delivery', placeholder: '', type: 'text', description: 'Cash, UPI and Cards accepted. Know more.' }
];
