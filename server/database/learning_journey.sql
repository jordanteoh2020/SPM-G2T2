DELETE FROM `learning_journey`;

INSERT INTO `learning_journey` (`lj_id`, `staff_id`, `position_id`, `skill_id`, `course_id`) 
VALUES 
(1, '140001', 4, 15, 'MGT004'),
(1, '140001', 4, 17, 'SAL004'),
(2, '140001', 6, 6, 'MGT004'),
(2, '140001', 6, 6, 'COR002'),
(2, '140001', 6, 7, 'SAL004'),
(3, '140001', 7, 7, 'SAL004'),
(4, '140001', 16, 17, 'MGT001'),
(5, '140001', 1, 10, 'tch018');
