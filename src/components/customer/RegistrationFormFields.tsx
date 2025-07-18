
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormFieldsProps {
  form: RegistrationFormData;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RegistrationFormFields({ form, loading, onChange }: RegistrationFormFieldsProps) {
  return (
    <>
      <div>
        <Label htmlFor="name" className="text-[#190a02]">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={form.name}
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
