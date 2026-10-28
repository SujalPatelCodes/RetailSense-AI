import pandas as pd
from typing import Dict, Any, Tuple
import io


REQUIRED_ALIASES = {
    "order_id": ["orderid", "order_id", "invoice", "invoice_no", "transaction_id"],
    "order_date": ["order_date", "date", "orderdate", "invoice_date"],
    "customer_id": ["customer_id", "customerid", "customer", "cust_id"],
    "product": ["product", "product_name", "item", "item_name"],
    "category": ["category", "product_category", "cat"],
    "quantity": ["quantity", "qty", "units"],
    "unit_price": ["unit_price", "price", "unitprice", "rate"],
}


def normalize_columns(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, str]]:
    df_norm = df.copy()
    cols_lower = {c.lower().strip(): c for c in df_norm.columns}
    for target, aliases in REQUIRED_ALIASES.items():
        for a in aliases:
            if a in cols_lower:
                break
    rename_dict = {}
    for target, aliases in REQUIRED_ALIASES.items():
        for a in aliases:
            if a in cols_lower and target not in rename_dict.values():
                rename_dict[cols_lower[a]] = target
                break
    df_norm = df_norm.rename(columns=rename_dict)
    return df_norm


def validate_and_clean_csv(file_content: bytes) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    try:
        df = pd.read_csv(io.BytesIO(file_content))
    except Exception as e:
        raise ValueError(f"Invalid CSV file: {str(e)}")

    if df.empty:
        raise ValueError("CSV file is empty")

    df_norm = normalize_columns(df)
    required = ["order_id", "order_date", "quantity", "unit_price"]
    missing = [r for r in required if r not in df_norm.columns]
    if missing:
        raise ValueError(
            f"Missing required columns (need: order_id, order_date, quantity, unit_price). Missing: {missing}"
        )

    df_clean = df_norm.copy()
    df_clean["order_date"] = pd.to_datetime(df_clean["order_date"], errors="coerce")
    df_clean["quantity"] = pd.to_numeric(df_clean["quantity"], errors="coerce")
    df_clean["unit_price"] = pd.to_numeric(df_clean["unit_price"], errors="coerce")

    df_clean = df_clean.dropna(subset=["order_id", "order_date", "quantity", "unit_price"])
    df_clean = df_clean.drop_duplicates()

    df_clean["order_value"] = df_clean["quantity"] * df_clean["unit_price"]
    df_clean["year"] = df_clean["order_date"].dt.year
    df_clean["month"] = df_clean["order_date"].dt.month

    for opt in ["customer_id", "product", "category"]:
        if opt not in df_clean.columns:
            df_clean[opt] = "Unknown"
    df_clean = df_clean.fillna({"customer_id": "Unknown", "product": "Unknown", "category": "Unknown"})

    if df_clean.empty:
        raise ValueError("No valid rows remain after cleaning")

    summary = {"rows": len(df_clean), "columns": list(df_clean.columns), "dropped": len(df) - len(df_clean)}
    return df_clean, summary
