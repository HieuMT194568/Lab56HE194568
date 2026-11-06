import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:9000',
});
export default api;


// useEffect(() => {
//     const fetch = async () => {
//       try {
//         const res = await api.get('/API');
//         setRes(res.data);
//       } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu:', error);
//       }
//     };

//     fetch();
//   }, []);

// const { id } = useParams();

// useEffect(() => {
//   const load = async () => {
//     try {
//       const [clsRes, subRes, sumRes, stuRes] = await Promise.all([
//         api.get(`/classes/${id}`),
//         api.get('/subjects'),
//         api.get('/attendanceSummaries', { params: { classId: id } }),
//         api.get('/students'),
//       ]);
//       setCls(clsRes.data);
//       setSubjects(subRes.data);
//       setSummaries(sumRes.data);
//       setStudents(stuRes.data);
//     } catch {
//       setError('Cannot load data');
//     }
//   };
//   load();
// }, [id]);

