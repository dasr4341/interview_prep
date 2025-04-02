import React, { useEffect, useState } from 'react';
import { passwordStrength } from 'check-password-strength';

export default function PassWordValidation({ password }: { password: string }) {
  const [strength, setStrength] = useState<string>('too-weak');
  const passwordTypes = ['too-weak', 'weak', 'medium', 'strong'];
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const st = passwordStrength(password).value.toLowerCase();
    setStrength(st);
    setLevel(passwordTypes.findIndex((t) => st === t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  function getBgClass(type: string) {
    type = type.toLowerCase();
    switch (type) {
      case 'too weak':
        return 'bg-red-800';

      case 'weak':
        return 'bg-orange';

      case 'medium':
        return 'bg-orange';

      case 'strong':
        return 'bg-green';

      default:
        return 'bg-red-800';
    }
  }

  function getTextClass(type: string) {
    type = type.toLowerCase();
    switch (type) {
      case 'too weak':
        return 'text-red-800';
      case 'weak':
        return 'text-red-800';

      case 'medium':
        return 'text-orange';

      case 'strong':
        return 'text-green';

      default:
        return 'text-red-800';
    }
  }

  return (
    <>
      <div
        className={`capitalize my-2 text-xxs flex gap-2 items-center
        ${getTextClass(strength)}
      `}>
        <div className="w-5/12">{strength} password</div>

        <div className="w-full flex">
          <span className={`h-1  w-1/3 ${getBgClass(strength)}`}></span>
          {level > 1 && <span className={`h-1  w-1/3 ml-1 mr-1 ${getBgClass(strength)}`}></span>}
          {level > 2 && <span className={`h-1  w-1/3 ml-1 mr-1 ${getBgClass(strength)}`}></span>}
        </div>
      </div>
    </>
  );
}
