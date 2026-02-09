import { getColorStyles } from '../utils/colors';

interface TagProps {
  color: string;
  label: string;
  small?: boolean;
}

export default function Tag({ color, label, small = false }: TagProps) {
  const styles = getColorStyles(color);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-help ${
        small ? 'text-xs px-2 py-0.5' : ''
      }`}
      style={{
        backgroundColor: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`,
        color: styles.hex,
      }}
      title={label}
    >
      {label}
    </span>
  );
}
