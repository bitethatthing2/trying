import { FC, ReactNode } from 'react';

interface MenuGroupProps {
  subtext?: string;
  children: ReactNode;
}

const MenuGroup: FC<MenuGroupProps> = ({ subtext, children }) => {
  return (
    <div>
      {subtext && (
        <div className="mb-3">
          <span className="text-bar-accent font-medium text-sm">{subtext}</span>
        </div>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export default MenuGroup; 