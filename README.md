# Lossless KV Cache Compression Benchmarks

An open, extensible benchmarking effort for **lossless compression of LLM KV caches**. We plan to support **BF16, FP8 (E4M3FN/E5M2)**, and additional KV formats and tensor layouts, with an evaluation interface that can work with **LMCache or other KV storage and serving backends**.

**Website:** https://liuzedooong.github.io/kv-cache-lossless-benchmarks/

**First technical study:** [Lossless Compression of FP8 KV Caches: What Actually Helps?](https://liuzedooong.github.io/kv-cache-lossless-benchmarks/blog/fp8-lossless-2026/)

## Why this project?

A compression ratio alone does not tell a serving system which lossless codec to use. Codec choice depends on payload format, chunk/frame geometry, encoding overhead, decoder availability, and the effective I/O path. We are building a framework to compare these factors using the same data and accounting conventions.

We aim to measure:

- **Lossless correctness:** exact restoration of raw KV bytes.
- **Compression ratio:** counting required per-frame overhead, with transparent treatment of scales and descriptors.
- **CPU encoding throughput:** measured in uncompressed KV GB/s, with worker count and setup scope explicit.
- **GPU decoding throughput:** measured in uncompressed KV GB/s, distinguishing GPU-resident codec timing from host-to-device transport.
- **Cache geometry:** attention layout, independently decodable chunk sizes, and layer/group variation.
- **Applicability:** which codecs work for BF16, E4M3FN, E5M2, and model-specific KV layouts.

## First release: FP8 benchmark research note

The initial study uses FP8 KV payload exports from Qwen and DeepSeek and compares Zstd levels, Deflate, LZ4, LZ4-HC, Snappy, and CPU-only Brotli. It also examines page-size sensitivity, layer-specific compressibility, and reversible preprocessing. The article explicitly states which benchmarks include GPU decompression and which do not.

- [Read the study](https://liuzedooong.github.io/kv-cache-lossless-benchmarks/blog/fp8-lossless-2026/)
- [Read the Markdown source](docs/blog/fp8-lossless-2026/article.md)
- [Discuss lossless compression in LMCache RFC #4498](https://github.com/LMCache/LMCache/issues/4498)

## Repository roadmap

| Area | Status |
| --- | --- |
| FP8 technical study and benchmark methodology | **Published** |
| BF16 / FP8 benchmark harness | Planned |
| Machine-readable full benchmark results | Planned |
| Independent prompts / trace-based validation | Planned |
| LMCache and other backend adapters | Planned |
| End-to-end L2 retrieval measurements | Planned |

**Scope note:** This first release includes the technical article and figures. Benchmark scripts, raw KV captures, and machine-readable full experiment results are **not yet published**. We will add them separately once their packaging and reproducibility have been reviewed.

## Collaboration

We welcome feedback on codec baselines, BF16/FP8 KV layouts, lossless GPU decoder interfaces, representative public data, and fair benchmarking methodology. You can [open an issue](https://github.com/Liuzedooong/kv-cache-lossless-benchmarks/issues) or discuss interface alignment in [LMCache RFC #4498](https://github.com/LMCache/LMCache/issues/4498).

This is an independent research and benchmarking effort, **not an official LMCache project**. We hope it will be useful to LMCache and other KV cache systems.
