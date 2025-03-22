import { FC, ReactNode } from 'react';

interface MenuCategoryProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const MenuCategory: FC<MenuCategoryProps> = ({ title, description, children }) => {
  return (
    <div className="bg-black/80 border border-gray-800 rounded-lg p-4 md:p-6 hover:border-bar-accent/30 transition-colors">
      <h3 className="font-display text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm mb-4">{description}</p>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default MenuCategory; 