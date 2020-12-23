import React from 'react';
import Select from 'react-select';

export default ({data,createChannel,addUsers}) => (
  <Select
    defaultValue={[]}
    isMulti
    name="users"
    options={data}
    className="basic-multi-select"
    classNamePrefix="select"
    onChange = {(e)=>addUsers(e)}
  />
);