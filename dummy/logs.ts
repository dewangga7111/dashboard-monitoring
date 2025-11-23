import { Logs } from "@/types/logs";


const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const dummyLogs: Logs[] = [
  {
    id: 1,
    service_name: "frontend-service",
    host: "192.168.1.10",
    description: "Frontend service",
    log_count_debug: random(1500, 5000),
    log_count_info: random(3000, 8000),
    log_count_warning: random(200, 700),
    log_count_error: random(50, 200),
  },
  {
    id: 2,
    service_name: "backend-service",
    host: "192.168.1.20",
    description: "Backend service",
    log_count_debug: random(1200, 4500),
    log_count_info: random(2500, 7000),
    log_count_warning: random(150, 600),
    log_count_error: random(20, 150),
  },
  {
    id: 3,
    service_name: "payment-service",
    host: "192.168.1.30",
    description: "Handles billing, invoices, and transactions",
    log_count_debug: random(800, 3000),
    log_count_info: random(2000, 6000),
    log_count_warning: random(300, 900),
    log_count_error: random(80, 250),
  },
  {
    id: 4,
    service_name: "api-gateway",
    host: "192.168.1.40",
    description: "Entry point of all external API calls",
    log_count_debug: random(2000, 6000),
    log_count_info: random(5000, 12000),
    log_count_warning: random(500, 1000),
    log_count_error: random(100, 350),
  },
  {
    id: 5,
    service_name: "notification-service",
    host: "192.168.1.50",
    description: "Email, SMS, and push notifications dispatcher",
    log_count_debug: random(900, 3500),
    log_count_info: random(1500, 5000),
    log_count_warning: random(100, 400),
    log_count_error: random(20, 120),
  },
];

export const dummyLogsJson: any = [
  {
    "line": "{\"body\":\"Matched route \\\"{route}\\\".\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:05.309Z\"}",
    "date": "2025-11-17T13:54:05.309Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Session ID: b2fcbe5b4a56da0a24d2aa0720ccd12c\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:05.311Z\"}",
    "date": "2025-11-17T13:54:05.311Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Country: Spain\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:05.312Z\"}",
    "date": "2025-11-17T13:54:05.312Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Calculating discount for product: 27\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:05.427Z\"}",
    "date": "2025-11-17T13:54:05.427Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Discount calculated: 0\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:05.427Z\"}",
    "date": "2025-11-17T13:54:05.427Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Matched route \\\"{route}\\\".\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:07.745Z\"}",
    "date": "2025-11-17T13:54:07.745Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Session ID: b2fcbe5b4a56da0a24d2aa0720ccd12c\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:07.748Z\"}",
    "date": "2025-11-17T13:54:07.748Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Country: Spain\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:07.772Z\"}",
    "date": "2025-11-17T13:54:07.772Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Unable to fetch related products: DatabaseConnectionException: Connection to the database failed.\",\"severity\":\"ERROR\",\"timestamp\":\"2025-11-17T13:54:07.912Z\"}",
    "date": "2025-11-17T13:54:07.912Z",
    "level": "ERROR"
  },
  {
    "line": "{\"body\":\"Uncaught PHP Exception Symfony\\\\Component\\\\HttpKernel\\\\Exception\\\\BadRequestHttpException: \\\"DatabaseConnectionException: Connection to the database failed.\\\" at HttpException.php line 34\",\"severity\":\"ERROR\",\"timestamp\":\"2025-11-17T13:54:07.917Z\"}",
    "date": "2025-11-17T13:54:07.917Z",
    "level": "ERROR"
  },
  {
    "line": "{\"body\":\"Session ID: b2fcbe5b4a56da0a24d2aa0720ccd12c\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:07.921Z\"}",
    "date": "2025-11-17T13:54:07.921Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Country: Spain\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:07.922Z\"}",
    "date": "2025-11-17T13:54:07.922Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Matched route \\\"{route}\\\".\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:10.012Z\"}",
    "date": "2025-11-17T13:54:10.012Z",
    "level": "INFO"
  },
  {
    "line": "{\"body\":\"Session ID: b2fcbe5b4a56da0a24d2aa0720ccd12c\",\"severity\":\"INFO\",\"timestamp\":\"2025-11-17T13:54:10.016Z\"}",
    "date": "2025-11-17T13:54:10.016Z",
    "level": "INFO"
  }
]
