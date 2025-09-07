// Utility function to detect if input is email or phone
const detectLoginType = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;
  if (emailRegex.test(value)) return 'email';
  if (phoneRegex.test(value)) return 'phoneNumber';
  return null;
};

export default detectLoginType;