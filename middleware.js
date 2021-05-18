import osjs from 'osjs';

osjs.middleware('osjs/filemanager:menu:edit', (({file}) => {
  let filepath = file.path;
  console.log(filepath)
  return [{
    label: 'Office',
    onclick: () => osjs.run('Office', {filepath})
  }];
}));
