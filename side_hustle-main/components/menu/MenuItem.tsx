import { FC } from 'react';

interface MenuItemProps {
  name: string;
  price: string;
  description?: string;
  tags?: string[];
}

const MenuItem: FC<MenuItemProps> = ({ name, price, description, tags }) => {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between mb-1">
        <h4 className="font-medium text-white">{name}</h4>
        <span className="text-bar-accent font-medium">{price}</span>
      </div>
      {description && (
        <p className="text-gray-400 text-sm">{description}</p>
      )}
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mt-1">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-bar-accent/20 text-bar-accent px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem; 