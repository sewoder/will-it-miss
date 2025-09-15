import React from 'react';
import { useAsync } from 'react-async-hook';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import Orbital from './Orbital';
import zhCN from 'date-fns/locale/zh-CN';

function getDate(d = new Date()) {
  return d.toJSON().split('T')[0];
}

const fetchData = () =>
  fetch(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${getDate()}&api_key=DEMO_KEY`
  ).then((res) => res.json());

export default function App() {
  const data = useAsync(fetchData, []);

  if (data.loading) {
    document.title = '计算潜在的地球危险…';

    return (
      <p>
        正在从 NASA 获取数据，以检查是否有来自太空的物体将要撞击我们。请稍等…
      </p>
    );
  }

  const day = getDate(addDays(new Date(), 1));
  // 加入数据有效性判断，防止报错，频繁访问该API时可能会遇到这种情况
  const dayObjects = data.result?.near_earth_objects?.[day];
  if (!dayObjects) {
    document.title = '无法获取数据 😢';
    return (
      <div>
        <p>
          NASA 没有返回 {day} 的近地天体数据，可能是 API 限制或数据尚未更新。
        </p>
      </div>
    );
  }
  // 若数据正常，则继续执行后续操作
  const hazards = data.result.near_earth_objects[day].reduce((acc, curr) => {
    if (curr.is_potentially_hazardous_asteroid) {
      return acc + 1;
    }
    return acc;
  }, 0);

  document.title = `${hazards} 潜在危险 ${hazards > 0 ? '😱' : '👍'}`;

  const results = data.result.near_earth_objects[day];
  return (
    <div>
      <p>
        {format(addDays(new Date(), 1), 'EEEE d-MMM', { locale: zhCN })} 将会有{' '}
        <strong>{results.length}</strong> 个近地天体经过地球轨道
      </p>
      <hr></hr>
      {results
        .sort((a) => (a.is_potentially_hazardous_asteroid ? -1 : 1))
        .map((data) => (
          <Orbital key={data.id} {...data} />
        ))}
    </div>
  );
}
