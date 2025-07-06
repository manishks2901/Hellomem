import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GET_COUNTRIES_LIST, GET_STATE_LIST, CountryList, StateProvince } from '../../services/apiConfig';
import Config from '../../../config';

export type RegisterRequestParameters = {
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  Password: string;
  MobileNo: string;
  AddressLineOne: string;
  CityId: string;
  StateProvinceId: string;
  PostalCode: string;
  CountryID: string;
};

const Signup: React.FC = () => {
  const [form, setForm] = useState<RegisterRequestParameters>({
    FirstName: '',
    LastName: '',
    EmailAddress: '',
    Password: '',
    MobileNo: '',
    AddressLineOne: '',
    CityId: '',
    StateProvinceId: '',
    PostalCode: '',
    CountryID: '',
  });
  const [countries, setCountries] = useState<CountryList[]>([]);
  const [states, setStates] = useState<StateProvince[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    GET_COUNTRIES_LIST().then(setCountries);
  }, []);

  useEffect(() => {
    if (form.CountryID) {
      GET_STATE_LIST(form.CountryID).then(setStates);
    } else {
      setStates([]);
    }
  }, [form.CountryID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = { requestParameters: form };
      await axios.post(
        `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}signup-user`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSuccess('Signup successful! Please login.');
      setForm({
        FirstName: '', LastName: '', EmailAddress: '', Password: '', MobileNo: '', AddressLineOne: '', CityId: '', StateProvinceId: '', PostalCode: '', CountryID: '',
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 mt-10 mb-10 rounded-2xl shadow-2xl w-full max-w-lg space-y-6 border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-indigo-700 tracking-tight">Create your account</h2>
        <p className="text-center text-gray-500 mb-4">Sign up to get started with Hellomem</p>
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded text-center text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-center text-sm">
            {error}
          </div>
        )}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              name="FirstName"
              value={form.FirstName}
              onChange={handleChange}
              required
              placeholder="First Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              name="LastName"
              value={form.LastName}
              onChange={handleChange}
              required
              placeholder="Last Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            name="EmailAddress"
            value={form.EmailAddress}
            onChange={handleChange}
            required
            type="email"
            placeholder="Email Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            name="Password"
            value={form.Password}
            onChange={handleChange}
            required
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input
            name="MobileNo"
            value={form.MobileNo}
            onChange={handleChange}
            required
            placeholder="Mobile Number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
          <input
            name="AddressLineOne"
            value={form.AddressLineOne}
            onChange={handleChange}
            required
            placeholder="Shipping Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              name="CountryID"
              value={form.CountryID}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
              title="Select Country"
            >
              <option value="">Select Country</option>
              {countries.length === 0 ? (
                <option value="" disabled>No countries found</option>
              ) : (
                countries.map((c) => (
                  <option key={c.CountryID} value={c.CountryID}>{c.CountryName}</option>
                ))
              )}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
            <select
              name="StateProvinceId"
              value={form.StateProvinceId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
              title="Select State/Province"
            >
              <option value="">Select State/Province</option>
              {states.length === 0 ? (
                <option value="" disabled>No states found</option>
              ) : (
                states.map((s) => (
                  <option key={s.StateProvinceID} value={s.StateProvinceID}>{s.StateName}</option>
                ))
              )}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City ID (optional)</label>
          <input
            name="CityId"
            value={form.CityId}
            onChange={handleChange}
            placeholder="City ID (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <input
            name="PostalCode"
            value={form.PostalCode}
            onChange={handleChange}
            required
            placeholder="Postal Code"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow hover:from-indigo-600 hover:to-blue-600 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Signing Up...
            </span>
          ) : (
            'Sign Up'
          )}
        </button>
        <div className="text-center text-sm text-gray-500 mt-2">
          Already have an account?{' '}
          <a href="/auth/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default Signup;
