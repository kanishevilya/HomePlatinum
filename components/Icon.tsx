import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Icon({
  name,
  color,
  size,
  addStyle,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size: number;
  addStyle?: any | null;
}) {
  return (
    <FontAwesome
      name={name}
      color={color}
      size={size} 
      style={ addStyle ? [{ marginBottom: -3 }, addStyle] : { marginBottom: -3 }}
    />
  );
}