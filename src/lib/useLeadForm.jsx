import { useState } from 'react';

/* Shared lead form logic: bulk quote, contact and product enquiry forms.
   Validates required fields, Indian mobile numbers and email. */
export function useLeadForm() {
  const [errors, setErrors] = useState({});
  const [sentName, setSentName] = useState('');
  const onSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget, errs = {};
    let first = null;
    form.querySelectorAll('[required]').forEach(i => {
      const v = (i.value || '').trim();
      let msg = '';
      if (!v) msg = 'This field is required.';
      else if (i.type === 'tel' && !/^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))) msg = 'Enter a 10-digit mobile number.';
      errs[i.name] = msg;
      if (msg && !first) first = i;
    });
    const em = form.querySelector('input[type="email"]');
    if (em && em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) {
      errs[em.name] = 'Enter an email address like name@example.com.';
      if (!first) first = em;
    }
    setErrors(errs);
    if (first) { first.focus(); return; }
    setSentName(form.elements.name.value.trim().split(' ')[0]);
    form.reset();
  };
  const err = name => ({ 'aria-invalid': errors[name] ? 'true' : undefined });
  const msg = name => <span className="err">{errors[name] || ''}</span>;
  return { onSubmit, err, msg, sentName };
}

