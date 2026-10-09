import React from 'react';
import * as Icons from 'lucide-react';

export const CategoryIcon = ({ iconName, color = '#6366f1', bg = 'rgba(99, 102, 241, 0.15)', size = 18 }) => {
  const IconComponent = Icons[iconName] || Icons.Tag;

  return (
    <div
      style={{
        backgroundColor: bg,
        color: color,
        width: size * 2,
        height: size * 2,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 2px 8px ${color}20`
      }}
    >
      <IconComponent size={size} strokeWidth={2.2} />
    </div>
  );
};

export default CategoryIcon;
