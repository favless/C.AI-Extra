type iconProps = {
  type?: string;
};

function Icon(props: iconProps) {
  function getExtensionURL(path: string) {
    return browser?.runtime.getURL(path) ?? chrome?.runtime.getURL(path);
  }

  const url = getExtensionURL(`assets/svg/${props.type}.svg`);

  return (
    <svg
      style={{
        mask: `url("${url}") center / contain no-repeat`,
        WebkitMask: `url("${url}") center / contain no-repeat`,
      }}
    ></svg>
  );
}

export default Icon;
