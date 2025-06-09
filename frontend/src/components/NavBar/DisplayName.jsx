const DisplayName = ({ name }) => {
  const names = name.split(' ');
  const shouldUseThree = names[1]?.length <= 2 && names.length >= 3;
  const displayed = shouldUseThree ? names.slice(0, 3) : names.slice(0, 2);
  return <span>{displayed.join(' ')}</span>;
};

export default DisplayName;
