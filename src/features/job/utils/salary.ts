// Utils format lương cho job
// - Nếu cả min và max đều null/0 -> "Thỏa thuận"
// - Nếu có cả min và max       -> "X triệu - Y triệu"
// - Nếu chỉ có max             -> "Tới X triệu"
// - Nếu chỉ có min             -> "Từ X triệu"

export const formatJobSalary = (
  salaryMin?: number,
  salaryMax?: number,
): string => {
  const min = salaryMin ?? 0;
  const max = salaryMax ?? 0;

  if ((!min || min === 0) && (!max || max === 0)) {
    return "Thỏa thuận";
  }

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(0)} triệu`;
    }
    return `${(num / 1_000).toFixed(0)}k`;
  };

  if (min && min > 0 && max && max > 0) {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }
  if (max && max > 0) {
    return `Tới ${formatNumber(max)}`;
  }
  if (min && min > 0) {
    return `Từ ${formatNumber(min)}`;
  }

  return "Thỏa thuận";
};

