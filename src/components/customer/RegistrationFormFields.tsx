
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormFieldsProps {
  form: CustomerRegistrationData;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RegistrationFormFields({ form, loading, onChange }: RegistrationFormFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="fullName" className="text-[#190a02]">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={onChange}
          className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
          placeholder="Enter your full name"
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-[#190a02]">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
          placeholder="Enter your email"
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-[#190a02]">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
          placeholder="Enter your phone number"
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="address" className="text-[#190a02]">Address</Label>
        <Input
          id="address"
          name="address"
          type="text"
          value={form.address}
          onChange={onChange}
          className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
          placeholder="Enter your address"
          required
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city" className="text-[#190a02]">City</Label>
          <Input
            id="city"
            name="city"
            type="text"
            value={form.city}
            onChange={onChange}
            className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
            placeholder="Enter your city"
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="state" className="text-[#190a02]">State</Label>
          <Input
            id="state"
            name="state"
            type="text"
            value={form.state}
            onChange={onChange}
            className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
            placeholder="Enter your state"
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="pincode" className="text-[#190a02]">Pincode</Label>
          <Input
            id="pincode"
            name="pincode"
            type="text"
            value={form.pincode}
            onChange={onChange}
            className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
            placeholder="Enter your pincode"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="text-[#190a02]">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
          placeholder="Create a password"
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="text-[#190a02]">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
          placeholder="Confirm your password"
          required
          disabled={loading}
        />
      </div>
    </>
  );
}
