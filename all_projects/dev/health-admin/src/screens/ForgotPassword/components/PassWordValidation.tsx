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
    // 
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
        return 'text-orange';

      case 'medium':
        return 'text-orange';

      case 'strong':
        return 'text-green';

      default:
        return 'text-red-800';
    }
  }

  return (
    <React.Fragment>
      <div
        className={`capitalize my-2 text-xxs flex items-center
        ${getTextClass(strength)}
      `}>
        <div className="w-28">{strength} password</div>

        <div className="w-52 inline-flex">
          <span className={`h-1 mx-1 inline-block ${getBgClass(strength)}`} style={{ width: '68px' }}></span>
          {level > 1 && <span className={`h-1 mx-1 inline-block ${getBgClass(strength)}`} style={{ width: '68px' }}></span>}
          {level > 2 && <span className={`h-1 mx-1 inline-block ${getBgClass(strength)}`} style={{ width: '68px' }}></span>}
        </div>
      </div>
    </React.Fragment>
  );
}
