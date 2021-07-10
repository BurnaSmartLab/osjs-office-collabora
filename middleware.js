import osjs from 'osjs';

osjs.middleware('osjs/filemanager:menu:edit', ({file}) => {
  return [
    {
      label: 'Office',
      onclick: () => osjs.run('Office', {file}),
    },
  ];
});
