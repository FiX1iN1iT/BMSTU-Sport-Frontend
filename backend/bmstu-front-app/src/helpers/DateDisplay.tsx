import React from 'react';

interface DateDisplayProps {
  dateString: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({ dateString }) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return <div>--</div>
  }

  const formattedDate = date.toLocaleDateString('ru-RU', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return <div>{formattedDate}</div>;
};
