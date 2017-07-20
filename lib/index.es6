import { connect as reduxConnect } from "react-redux";
import { bindActionCreators } from "redux";

import { IncludeFilter, ExcludeFilter } from './lib/state-filters';
import reduxion from './lib/reduxion';

const include = keys => new IncludeFilter(keys);
const exclude = keys => new ExcludeFilter(keys);

export default reduxion;
export { include, exclude };
